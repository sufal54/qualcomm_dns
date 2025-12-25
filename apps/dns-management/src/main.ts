import { NestFactory } from '@nestjs/core';
import { DnsManagementModule } from './dns-management.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(DnsManagementModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
