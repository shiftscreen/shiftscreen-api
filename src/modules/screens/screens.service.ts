import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Screen } from './screens.entity';
import { NewScreenInput } from './dto/new-screen.input';

import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class ScreensService extends BaseService<Screen> {
  constructor(
    @InjectRepository(Screen)
    private readonly usersRepository: Repository<Screen>
  ) {
    super(usersRepository);
  }
}
