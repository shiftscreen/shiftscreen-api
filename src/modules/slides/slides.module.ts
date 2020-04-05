import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from '../roles/roles.module';
import { SlidesService } from './slides.service';
import { ScreensModule } from '../../screens/screens.module';
import { SlidesResolver } from './slides.resolver';
import { Slide } from './slides.entity';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => ScreensModule),
    TypeOrmModule.forFeature([Slide])
  ],
  providers: [SlidesService, SlidesResolver],
  exports: [SlidesService, TypeOrmModule],
})
export class SlidesModule {}
