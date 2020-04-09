import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Storage } from './storages.entity';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class StoragesService extends BaseService<Storage> {
  constructor(
    @InjectRepository(Storage)
    private readonly storagesRepository: Repository<Storage>,
  ) {
    super(storagesRepository);
  }

  async increaseUsed(storage: Storage, value: number): Promise<UpdateResult> {
    const { id } = storage;
    return this.storagesRepository.increment({ id }, 'usedKilobytes', value);
  }

  async decreaseUsed(storage: Storage, value: number): Promise<UpdateResult> {
    const { id } = storage;
    return this.storagesRepository.decrement({ id }, 'usedKilobytes', value);
  }
}
