import { Module } from '@nestjs/common';
import { UsersModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    InvoicesModule,
  ],
})
export class AppModule {}
