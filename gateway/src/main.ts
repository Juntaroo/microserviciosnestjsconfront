import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configuration';
import { ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');//Agrega un prefijo a todas las rutas HTTP

  app.enableCors({
    origin: '*', //['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({//Se aplica a todos los controladores de forma automática.
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());//Aplica un filtro global de excepciones.

  console.info(`Gateway Microservice running on port: ${envs.PORT}`);
  await app.listen(envs.PORT);
}
bootstrap();