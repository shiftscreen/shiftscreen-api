import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Screen } from './screens.entity';
import { NewScreenInput } from './dto/new-screen.input';

@Injectable()
export class ScreensService {
  constructor(
    @InjectRepository(Screen)
    private readonly screensRepository: Repository<Screen>,
  ) {}

  findOneById(id): Promise<Screen> {
    return this.screensRepository.findOneOrFail(id);
  }

  async create(screen: NewScreenInput): Promise<Screen> {
    return this.screensRepository.save(screen);
  }

  async updateOne(screen, data): Promise<Screen> {
    return this.screensRepository.save({
      ...screen,
      ...data
    });
  }

  async deleteOne(screen): Promise<DeleteResult> {
    return this.screensRepository.delete(screen.id);
  }
}
