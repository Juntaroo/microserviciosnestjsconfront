import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Crear usuario
  @MessagePattern({ cmd: 'createUser' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Listar usuarios con paginación
  @MessagePattern({ cmd: 'findAllUsers' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  // Buscar usuario por ID
  @MessagePattern({ cmd: 'findOneUser' })
  findOne(@Payload('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Actualizar usuario
  @MessagePattern({ cmd: 'updateUser' })
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  // Eliminar usuario (soft delete)
  @MessagePattern({ cmd: 'removeUser' })
  remove(@Payload('id') id: string) {
    return this.usersService.remove(id);
  }

  // Agregar producto al carrito
  @MessagePattern({ cmd: 'add_to_cart' })
  addToCart(
    @Payload()
    payload: { userId: string; productId: string; quantity: number },
  ) {
    return this.usersService.addToCart(
      payload.userId,
      payload.productId,
      payload.quantity,
    );
  }

  // Checkout del carrito
  @MessagePattern({ cmd: 'checkout_cart' })
  checkoutCart(@Payload('userId') userId: string) {
    return this.usersService.checkoutCart(userId);
  }
  @MessagePattern({ cmd: 'validateUser' })
async validateUser(@Payload() data: { email: string; password: string }) {
  const user = await this.usersService.validateUser(data.email, data.password);
  return user;
}
}
