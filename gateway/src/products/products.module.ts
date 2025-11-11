import { Module, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { envs } from 'src/configuration';
import { PRODUCTS_SERVICE } from 'src/configuration/constants';

@Module({
  controllers: [ProductsController],
  imports: [
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.MS_PRODUCT_HOST,
          port: envs.MS_PRODUCT_PORT,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ProductsModule {}
