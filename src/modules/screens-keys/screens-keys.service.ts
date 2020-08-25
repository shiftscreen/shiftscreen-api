import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { ScreenKey } from './screens-keys.entity';
import { Providers, PubSubIterators } from '../../constants';
import { PubSubEngine } from 'graphql-subscriptions';

@Injectable()
export class ScreensKeysService extends BaseService<ScreenKey> {
  constructor(
    @InjectRepository(ScreenKey)
    private readonly screensKeysRepository: Repository<ScreenKey>,

    @Inject(Providers.PUB_SUB)
    private readonly pubSub: PubSubEngine,
  ) {
    super(screensKeysRepository);
  }

  async findOneByPrivateKeyAndScreenId(privateKey: string, screenId: number): Promise<ScreenKey> {
    return this.findOneByConditions({
      where: {
        privateKey,
        screen: {
          id: screenId,
        }
      },
      relations: ['screen'],
    });
  }

  async screenKeyAddedIterator() {
    return this.pubSub.asyncIterator(PubSubIterators.SCREEN_KEY_ADDED);
  }

  async screenKeyAddedPublish(payload) {
    return this.pubSub.publish(PubSubIterators.SCREEN_KEY_ADDED, {
      [PubSubIterators.SCREEN_KEY_ADDED]: payload,
    });
  }
}
