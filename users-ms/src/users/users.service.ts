import { HttpStatus, Injectable, Logger, NotFoundException, Inject, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('MS_PRODUCT') private readonly productClient: ClientProxy,
    @Inject('MS_INVOICE') private readonly invoiceClient: ClientProxy,
  ) {}

  // Crear usuario con contraseña hasheada
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        roles: createUserDto.roles,
      },
    });
  }

  // Listar usuarios con paginación
  async findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
        where: paginationDto.withDeleted ? {} : { deletedAt: null },
      }),
      this.prisma.user.count({
        where: paginationDto.withDeleted ? {} : { deletedAt: null },
      }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByEmail(email: string) {
  return this.prisma.user.findUnique({ where: { email } });
}

  // Buscar usuario por ID
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new RpcException({
        message: `Usuario con ID ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }

  // Actualizar usuario
  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  // Soft delete (eliminar usuario)
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Agregar producto al carrito
  async addToCart(userId: string, productId: string, quantity: number) {
    // Verificar stock del producto en ProductsService
    const product = await firstValueFrom(
      this.productClient.send({ cmd: 'find_one_product' }, { id: productId }),
    );

    if (!product) {
      throw new RpcException({
        status: 404,
        message: `Producto con ID ${productId} no encontrado`,
      });
    }

    if ((product as any).stock < quantity) {
      throw new RpcException({
        status: 400,
        message: `Stock insuficiente para producto ${productId}`,
      });
    }

    // Guardar o actualizar en carrito usando upsert
    const cartItem = await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity },
      create: { userId, productId, quantity },
    });

    return cartItem;
  }

  // Generar factura desde el carrito
  async checkoutCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({ where: { userId } });
    if (cartItems.length === 0) {
      return { message: 'Carrito vacío' };
    }

    // Validar stock y preparar ítems de factura
    const invoiceItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await firstValueFrom(
          this.productClient.send(
            { cmd: 'find_one_product' },
            { id: item.productId },
          ),
        );

        if (!product || (product as any).stock < item.quantity) {
          throw new RpcException({
            status: 400,
            message: `Stock insuficiente para producto ${item.productId}`,
          });
        }

        return {
          productId: item.productId,
          descripcion: (product as any).productName,
          quantity: item.quantity,
          unitPrice: (product as any).price,
        };
      }),
    );

    // Descontar stock en ProductsService
    for (const item of invoiceItems) {
      await firstValueFrom(
        this.productClient.send(
          { cmd: 'decrease_stock' },
          { id: item.productId, quantity: item.quantity },
        ),
      );
    }

    // Obtener usuario
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new RpcException({ status: 404, message: 'Usuario no encontrado' });
    }

    // Crear DTO de factura
    const invoiceDto: CreateInvoiceDto = {
      numero: `FAC-${Date.now()}`,
      userId: user.id,
      total: invoiceItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
      items: invoiceItems,
    };

    // Crear factura en InvoicesService
    const invoice = await firstValueFrom(
      this.invoiceClient.send({ cmd: 'create_invoice' }, invoiceDto),
    );

    // Vaciar carrito
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return invoice;
  }
   async validateUser(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) throw new RpcException('Usuario no encontrado');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new RpcException('Contraseña incorrecta');

  return user;
}
}
