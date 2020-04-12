import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { Role } from './roles.entity';

import { OrganizationsModule } from '../organizations/organizations.module';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    forwardRef(() => OrganizationsModule),
    UsersModule,
    TypeOrmModule.forFeature([Role])
  ],
  providers: [RolesService, RolesResolver, OrganizationsService, UsersService],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
