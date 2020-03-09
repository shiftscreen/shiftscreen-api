import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Storage } from './storages.entity';
import { NewStorageInterface } from './interfaces/new-storage.interface';

import { User } from '../users/users.entity';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private readonly storagesRepository: Repository<Storage>,
  ) {}

  async findByUser(user: User): Promise<Storage> {
    return this.storagesRepository.findOneOrFail({ user });
  }

  async create(storage: NewStorageInterface): Promise<Storage> {
    return this.storagesRepository.save(storage);
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
