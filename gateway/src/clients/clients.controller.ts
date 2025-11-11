import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  Inject,
  UseGuards,
  Req,
  Injectable,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PaginationDto } from 'src/common';
import { CreateUserDto } from 'src/common/dtos/create-user-dto';
import { UpdateUserDto } from 'src/common/dtos/update-user.dto';
import { USERS_SERVICE } from 'src/configuration/constants';

// Utilidad para limpiar errores 
function normalizeError(err: any, defaultMessage: string) {
  const message = typeof err === 'string'
    ? err
    : err?.message || defaultMessage;

  const status = typeof err?.status === 'number'
    ? err.status
    : 500;

  return new HttpException(message, status);
}

// --- Guard dinámico de roles ---
export const RolesGuard = (requiredRoles: string[]) => {
  @Injectable()
  class RoleGuardMixin {
    canActivate(context: any): boolean {
      const req = context.switchToHttp().getRequest();
      const userRoles: string[] = req.user?.roles || [];
      return requiredRoles.some(role => userRoles.includes(role));
    }
  }
  return RoleGuardMixin;
};

@Controller('usuarios')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userClient.send({ cmd: 'createUser' }, createUserDto).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al crear usuario'))),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Get()
  findAllUsers(@Query() pagination: PaginationDto) {
    return this.userClient.send({ cmd: 'findAllUsers' }, pagination).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al listar usuarios'))),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    if (req.user.sub !== +id && !req.user.roles?.includes('ADMIN')) {
      throw new HttpException('No autorizado', 403);
    }

    return this.userClient.send({ cmd: 'findOneUser' }, id).pipe(
      catchError(err => throwError(() => normalizeError(err, `Usuario ${id} no encontrado`))),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    if (req.user.sub !== +id && !req.user.roles?.includes('ADMIN')) {
      throw new HttpException('No autorizado', 403);
    }

    return this.userClient.send({ cmd: 'updateUser' }, { id, dto: updateUserDto }).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al actualizar usuario'))),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userClient.send({ cmd: 'removeUser' }, id).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al eliminar usuario'))),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('carrito/agregar')
  addToCart(@Req() req, @Body() body: { productId: number; quantity: number }) {
    const userId = req.user.sub;

    return this.userClient.send({ cmd: 'add_to_cart' }, {
      userId,
      productId: body.productId,
      quantity: body.quantity,
    }).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al agregar al carrito'))),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('carrito/checkout')
  checkout(@Req() req) {
    const userId = req.user.sub;

    return this.userClient.send({ cmd: 'checkout_cart' }, { userId }).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al realizar compra'))),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Get('admin/all-users')
  getAllUsersForAdmin() {
    return this.userClient.send({ cmd: 'findAllUsers' }, {}).pipe(
      catchError(err => throwError(() => normalizeError(err, 'Error al listar usuarios'))),
    );
  }
}
