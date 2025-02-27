
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())  // ✅ Enables DTO validation globally
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
