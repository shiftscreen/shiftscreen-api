import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreensService } from './screens.service';
import { RolesModule } from '../modules/roles/roles.module';
import { SlidesModule } from '../modules/slides/slides.module';
import { ScreensResolver } from './screens.resolver';
import { Screen } from './screens.entity';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    SlidesModule,
    TypeOrmModule.forFeature([Screen])
  ],
  providers: [ScreensService, ScreensResolver],
  exports: [ScreensService, TypeOrmModule],
})
export class ScreensModule {}
