import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { Role } from './roles.entity';

import { ScreensModule } from '../screens/screens.module';
import { ScreensService } from '../screens/screens.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    forwardRef(() => ScreensModule),
    UsersModule,
    TypeOrmModule.forFeature([Role])
  ],
  providers: [RolesService, RolesResolver, ScreensService, UsersService],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
