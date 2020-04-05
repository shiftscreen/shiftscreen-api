import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Slide } from './slides.entity';
import { NewSlideInput } from './dto/new-slide.input';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private readonly slidesRepository: Repository<Slide>,
  ) {}

  findOneById(id): Promise<Slide> {
    return this.slidesRepository.findOneOrFail(id);
  }

  async create(slide): Promise<Slide> {
    return this.slidesRepository.save(slide);
  }

  async updateOne(slide, data): Promise<Slide> {
    return this.slidesRepository.save({
      ...slide,
      ...data
    });
  }

  async deleteOne(screen): Promise<DeleteResult> {
    return this.slidesRepository.delete(screen.id);
  }
}
