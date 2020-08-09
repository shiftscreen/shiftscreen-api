import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));

  await app.listen(port);
}
bootstrap();
