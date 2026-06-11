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
  const frontendApiUrl = config.get<string>('FRONTEND_API_URL');

  await seedSuperAdmin(prisma);

  console.log(`Frontend URL: ${frontendUrl}`);
  console.log(`Server is running on port ${port}`);
  console.log(`Frontend API URL: ${frontendApiUrl}`);  // Added this line to log the frontend API URL
  console.log(`Server is running on port ${port}`);  // Added this line to log the server port

  app.enableCors({
    origin: [ frontendApiUrl ,frontendUrl ],
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
