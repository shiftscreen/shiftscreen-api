import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesKeysService } from './files-keys.service';
import { FilesKeysResolver } from './files-keys.resolver';

import { FileKey } from './files-keys.entity';
import { FilesModule } from '../files/files.module';
import { FilesService } from '../files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileKey]),
    FilesModule,
  ],
  providers: [
    FilesKeysService,
    FilesKeysResolver,
    FilesService,
  ],
  exports: [
    FilesKeysService,
    TypeOrmModule
  ],
})
export class FilesKeysModule {}
