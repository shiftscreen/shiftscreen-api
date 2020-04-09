import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Slide } from './slides.entity';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class SlidesService extends BaseService<Slide> {
  constructor(
    @InjectRepository(Slide)
    private readonly slidesRepository: Repository<Slide>,
  ) {
    super(slidesRepository);
  }

}
