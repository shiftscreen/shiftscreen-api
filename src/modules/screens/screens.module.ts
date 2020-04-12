import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from '../roles/roles.module';
import { SlidesModule } from '../slides/slides.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { OrganizationsService } from '../organizations/organizations.service';
import { ScreensService } from './screens.service';
import { ScreensResolver } from './screens.resolver';
import { Screen } from './screens.entity';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    SlidesModule,
    OrganizationsModule,
    TypeOrmModule.forFeature([Screen])
  ],
  providers: [ScreensService, ScreensResolver, OrganizationsService],
  exports: [ScreensService, TypeOrmModule],
})
export class ScreensModule {}
