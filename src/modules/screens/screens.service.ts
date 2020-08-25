import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screen } from './screens.entity';
import { PubSubEngine } from 'graphql-subscriptions';

import { BaseService } from '../../shared/base/base.service';
import { Providers, PubSubIterators } from '../../constants';

@Injectable()
export class ScreensService extends BaseService<Screen> {
  constructor(
    @InjectRepository(Screen)
    private readonly usersRepository: Repository<Screen>,

    @Inject(Providers.PUB_SUB)
    private readonly pubSub: PubSubEngine,
  ) {
    super(usersRepository);
  }

  async screenUpdatedIterator() {
    return this.pubSub.asyncIterator(PubSubIterators.SCREEN_UPDATED);
  }

  async screenUpdatedPublish(payload) {
    return this.pubSub.publish(PubSubIterators.SCREEN_UPDATED, {
      [PubSubIterators.SCREEN_UPDATED]: payload,
    });
  }
}
