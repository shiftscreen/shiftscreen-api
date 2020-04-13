import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { Role } from './roles.entity';
import { User } from '../users/users.entity';
import { Organization } from '../organizations/organizations.entity';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository);
  }

  async findOneUserRole(user: Partial<User>, organization: Partial<Organization>): Promise<Role> {
    return this.findOneByConditions({ user, organization })
  }
}
