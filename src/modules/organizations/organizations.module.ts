import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';

import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { Organization } from './organizations.entity';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    TypeOrmModule.forFeature([Organization])
  ],
  providers: [OrganizationsService, OrganizationsResolver, RolesService],
  exports: [OrganizationsService, TypeOrmModule],
})
export class OrganizationsModule {}
