import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { seedSuperAdmin } from './auth/auth.seed';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const prisma =
    app.get(PrismaService);

    const config = app.get(ConfigService);

  const port = config.get<number>('PORT') || 5000;
  const frontendUrl = config.get<string>('FRONTEND_URL');

  await seedSuperAdmin(prisma);

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  console.log(`Application is running`);
}

void bootstrap();
