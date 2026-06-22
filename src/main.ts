import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: config.get<string>('PROFILES_HOST', '0.0.0.0'),
      port: config.get<number>('PROFILES_TCP_PORT', 4002),
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.get<number>('PORT', 3000));
}
void bootstrap();
