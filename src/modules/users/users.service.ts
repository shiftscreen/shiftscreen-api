import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { NewUserInput } from './dto/new-user.input';

@Injectable()
export class UsersService {
  private saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ email });
  }

  async create(user: NewUserInput): Promise<User> {
    user.password = await this.getHash(user.password);
    return this.usersRepository.save(user);
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
