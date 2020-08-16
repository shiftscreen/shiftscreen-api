import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreensKeysService } from './screens-keys.service';
import { ScreensKeysResolver } from './screens-keys.resolver';

import { ScreenKey } from './screens-keys.entity';
import { ScreensModule } from '../screens/screens.module';
import { ScreensService } from '../screens/screens.service';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreenKey]),
    ScreensModule,
    RolesModule,
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
