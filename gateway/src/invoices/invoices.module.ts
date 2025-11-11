import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoicesController } from './invoices.controller';
import { AuthModule } from 'src/auth/auth.module';
import { envs } from 'src/configuration';
import { INVOICES_SERVICE } from 'src/configuration/constants';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: INVOICES_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.MS_INVOICE_HOST,
          port: envs.MS_INVOICE_PORT,
        },
      },
    ]),
  ],
  controllers: [InvoicesController],
  exports: [ClientsModule],
})
export class InvoicesModule {}
