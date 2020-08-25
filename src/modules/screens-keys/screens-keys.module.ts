import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreensKeysService } from './screens-keys.service';
import { ScreensKeysResolver } from './screens-keys.resolver';

import { ScreenKey } from './screens-keys.entity';
import { ScreensModule } from '../screens/screens.module';
import { ScreensService } from '../screens/screens.service';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { PubSubModule } from '../pubsub/pubsub.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreenKey]),
    forwardRef(() => ScreensModule),
    RolesModule,
    PubSubModule,
  ],
  providers: [
    ScreensKeysService,
    ScreensKeysResolver,
    ScreensService,
    RolesService,
  ],
  exports: [
    ScreensKeysService,
    TypeOrmModule
  ],
})
export class ScreensKeysModule {}
