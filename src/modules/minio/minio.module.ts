import { Module } from '@nestjs/common';

import { MinioService } from './minio.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import minioConfig from '../../config/minio.config';

@Module({
  imports: [ConfigModule.forFeature(minioConfig)],
  providers: [MinioService, ConfigService],
  exports: [MinioService],
})
export class MinioModule {}
