import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppsInstancesService } from './apps-instances.service';
import { AppsInstancesResolver } from './apps-instances.resolver';
import { AppInstance } from './apps-instances.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppInstance])
  ],
  providers: [AppsInstancesService, AppsInstancesResolver],
  exports: [AppsInstancesService, TypeOrmModule],
})
export class AppsInstancesModule {}
