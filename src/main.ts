import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  let port: string | number = process.env.PORT;
  if (port == null || port == "") {
    port = 3333;
  }
  await app.listen(port);
}
bootstrap();
