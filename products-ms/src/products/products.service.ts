import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  findAll() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
  return this.prisma.product.findFirst({
    where: { id, deletedAt: null },
  });
}

async update(id: string, updateProductoDto: UpdateProductDto) {
  return this.prisma.product.update({
    where: { id },
    data: updateProductoDto,
  });
}

async remove(id: string) {
  return this.prisma.product.update({
    where: { id },
    data: { active: false, deletedAt: new Date() },
  });
}

async decreaseStock(id: string, quantity: number) {
  const product = await this.findOne(id);
  if (!product || product.stock < quantity) {
    throw new RpcException({ status: 400, message: 'Stock insuficiente' });
  }

  return this.prisma.product.update({
    where: { id },
    data: { stock: product.stock - quantity },
  });
}

async restoreStock(id: string, quantity: number) {
  return this.prisma.product.update({
    where: { id },
    data: { stock: { increment: quantity } },
  });
}
}