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

  async findOneUserRole(user: User, organization: Organization): Promise<Role> {
    return this.rolesRepository.findOneOrFail({
      user: Promise.resolve({ id: user.id }),
      organization: Promise.resolve({ id: organization }),
    });
  }
}
