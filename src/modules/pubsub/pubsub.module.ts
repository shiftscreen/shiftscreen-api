import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Providers } from '../../constants';

@Global()
@Module({
  providers: [
    {
      provide: Providers.PUB_SUB,
      useClass: PubSub,
    }
  ],
  exports: [Providers.PUB_SUB],
})
export class PubSubModule {}
