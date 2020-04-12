import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { Organization } from './organizations.entity';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {
    super(organizationsRepository);
  }
}
