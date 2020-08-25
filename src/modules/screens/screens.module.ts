import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from '../roles/roles.module';
import { SlidesModule } from '../slides/slides.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { OrganizationsService } from '../organizations/organizations.service';
import { AppsInstancesService } from '../apps-instances/apps-instances.service';
import { AppsInstancesModule } from '../apps-instances/apps-instances.module';
import { ScreensKeysModule } from '../screens-keys/screens-keys.module';
import { ScreensService } from './screens.service';
import { ScreensResolver } from './screens.resolver';
import { Screen } from './screens.entity';
import { PubSubModule } from '../pubsub/pubsub.module';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => ScreensKeysModule),
    SlidesModule,
    OrganizationsModule,
    AppsInstancesModule,
    TypeOrmModule.forFeature([Screen]),
    PubSubModule,
  ],
  providers: [ScreensService, ScreensResolver, OrganizationsService, AppsInstancesService],
  exports: [ScreensService, TypeOrmModule],
})
export class ScreensModule {}
