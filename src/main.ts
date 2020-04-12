import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));

  if (process.env.NODE_ENV === 'production') {
    app.use(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }));
  }

  await app.listen(port);
}
bootstrap();
