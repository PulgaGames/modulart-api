import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // En .NET: app.UsePathBase("/api") + MapControllers
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // En .NET: [ApiController] + FluentValidation / DataAnnotations
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const swagger = new DocumentBuilder()
    .setTitle('ModulArt API')
    .setDescription('CRUD de catálogo y cotizaciones — estudio NestJS / TypeORM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
  console.log(`ModulArt API → http://localhost:${port}/api/v1/health`);
  console.log(`Swagger      → http://localhost:${port}/docs`);
}

bootstrap();
