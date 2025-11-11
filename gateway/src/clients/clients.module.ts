import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './clients.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/configuration';
import { USERS_SERVICE } from 'src/configuration/constants';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  imports: [
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.MS_USER_HOST,
          port: envs.MS_USER_PORT,
        },
      },
    ]),
  ],
  exports: [ClientsModule, AuthModule],
})
export class UsersModule {}
