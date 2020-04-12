import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from '../roles/roles.module';
import { ScreensModule } from '../screens/screens.module';
import { AppsInstancesModule } from '../apps-instances/apps-instances.module';
import { AppsInstancesService } from '../apps-instances/apps-instances.service';
import { Slide } from './slides.entity';
import { SlidesResolver } from './slides.resolver';
import { SlidesService } from './slides.service';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => ScreensModule),
    AppsInstancesModule,
    TypeOrmModule.forFeature([Slide])
  ],
  providers: [SlidesService, SlidesResolver, AppsInstancesService],
  exports: [SlidesService, TypeOrmModule],
})
export class SlidesModule {}
