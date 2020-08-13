import { Module } from '@nestjs/common';

import { UtilsResolver } from './utils.resolver';
import { UtilsService } from './utils.service';

@Module({
  imports: [],
  providers: [
    UtilsResolver,
    UtilsService,
  ],
  exports: [UtilsService],
})
export class UtilsModule {}
