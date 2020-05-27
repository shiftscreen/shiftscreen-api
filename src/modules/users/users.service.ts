import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './users.entity';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findOneByEmail(email): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email
      }
    });
  }
}
