import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Profile Microservice API')
    .setDescription('Microservicio de perfiles para aficionados a la música')
    .setVersion('1.0')
    .addTag('profiles', 'Endpoints para la gestión de perfiles de aficionados')
    .addTag('preferences', 'Preferencias de usuario')
    .addTag('history', 'Historial de eventos del usuario')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: config.get<string>('PROFILES_HOST', '0.0.0.0'),
      port: config.get<number>('PROFILES_TCP_PORT', 4002),
    },
  });

  await app.startAllMicroservices();

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(
    `TCP microservice listening on port ${config.get<string>('PROFILES_TCP_PORT', '4002')}`,
  );
}
void bootstrap();
