import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'MS_PRODUCT',
        transport: Transport.TCP,
        options: {
          host: process.env.MS_PRODUCT_HOST ?? 'products-ms',
          port: Number(process.env.MS_PRODUCT_PORT ?? 3002),
        },
      },
      {
        name: 'MS_INVOICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MS_INVOICE_HOST ?? 'invoices-ms',
          port: Number(process.env.MS_INVOICE_PORT ?? 3003),
        },
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
