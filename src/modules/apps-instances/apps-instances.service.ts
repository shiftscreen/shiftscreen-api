import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { AppInstance } from './apps-instances.entity';

@Injectable()
export class AppsInstancesService extends BaseService<AppInstance> {
  constructor(
    @InjectRepository(AppInstance)
    private readonly appsInstancesRepository: Repository<AppInstance>,
  ) {
    super(appsInstancesRepository);
  }
}
