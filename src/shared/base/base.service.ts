import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { IBaseService } from './interfaces/base-service.interface';

@Injectable()
export class BaseService<T> implements IBaseService<T> {
  constructor(
    private readonly genericRepository: Repository<T>,
  ) {}

  async create(entity): Promise<T> {
    return this.genericRepository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.genericRepository.find();
  }

  async findOneById(id): Promise<T> {
    return this.genericRepository.findOneOrFail(id);
  }

  async findOneByConditions(conditions): Promise<T> {
    return this.genericRepository.findOne(conditions);
  }

  async findOneByIdWithRelations(id: string | number, relations: string[]): Promise<T> {
    return this.findOneByConditions({
      where: { id },
      relations: ['organization']
    });
  }

  async updateOne(id: string | number, entity): Promise<T> {
    await this.genericRepository.update(id, entity);
    return this.genericRepository.findOneOrFail(id);
  }

  async deleteOne(id: string | number): Promise<DeleteResult> {
    return this.genericRepository.delete(id);
  }
}
