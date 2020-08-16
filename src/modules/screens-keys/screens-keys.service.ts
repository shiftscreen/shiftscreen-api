import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { ScreenKey } from './screens-keys.entity';

@Injectable()
export class ScreensKeysService extends BaseService<ScreenKey> {
  constructor(
    @InjectRepository(ScreenKey)
    private readonly screensKeysRepository: Repository<ScreenKey>,
  ) {
    super(screensKeysRepository);
  }
}
