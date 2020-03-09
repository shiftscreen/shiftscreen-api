import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';

import { File } from './files.entity';
import { Upload } from '../shared/scalars/upload.scalar';
import { MinioService } from '../minio/minio.service';
import { StoragesModule } from '../storages/storages.module';
import { StoragesService } from '../storages/storages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    Upload,
    ConfigModule,
    StoragesModule
  ],
  providers: [
    FilesService,
    FilesResolver,
    Upload,
    MinioService,
    ConfigService,
    StoragesService
  ],
  exports: [
    FilesService,
    TypeOrmModule
  ],
})
export class FilesModule {}
