import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async findOneById(id): Promise<Role> {
    return this.rolesRepository.findOneOrFail(id);
  }

  async findOneByConditions(conditions): Promise<Role> {
    return this.rolesRepository.findOne(conditions);
  }

  async findOneUserRole(user, screen): Promise<Role> {
    return this.rolesRepository.findOneOrFail({
      user,
      screen
    })
  }

  async create(role): Promise<Role> {
    return this.rolesRepository.save(role);
  }

  async updateOne(role, data): Promise<Role> {
    return this.rolesRepository.save({
      ...role,
      ...data
    });
  }

  async deleteOne(role): Promise<DeleteResult> {
    return this.rolesRepository.delete(role.id);
  }
}
