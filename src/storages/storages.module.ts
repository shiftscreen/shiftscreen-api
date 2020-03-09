import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoragesService } from './storages.service';
import { Storage } from './storages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  providers: [StoragesService],
  exports: [StoragesService, TypeOrmModule],
})
export class StoragesModule {}
