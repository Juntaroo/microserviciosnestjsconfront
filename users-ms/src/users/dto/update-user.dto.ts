import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsPositive, IsOptional, IsDate } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsPositive()
  id: string;

   @IsOptional()
  password?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
