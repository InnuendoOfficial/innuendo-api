import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  // Swagger (documentation) setup)
  const config = new DocumentBuilder()
    .setTitle('Innuendo')
    .setDescription('Official documentation of the Innuendo\' API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  if (process.env.SENTRY_DNS)  {
    Sentry.init({
      dsn: process.env.SENTRY_DNS,
    });
  }

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT);
  console.info('Listening on ' + PORT);
}

bootstrap();
