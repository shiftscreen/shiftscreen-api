import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { AppInstance } from './apps-instances.entity';
import { User } from '../users/users.entity';

@Injectable()
export class AppsInstancesService extends BaseService<AppInstance> {
  constructor(
    @InjectRepository(AppInstance)
    private readonly appsInstancesRepository: Repository<AppInstance>,
  ) {
    super(appsInstancesRepository);
  }

  async findOneByIdAndOwner(id: number | string, user: User): Promise<AppInstance> {
    return this.appsInstancesRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        }
      },
    });
  }
}
