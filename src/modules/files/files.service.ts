import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { File } from './files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  async findOneById(id): Promise<File> {
    return this.filesRepository.findOneOrFail(id);
  }

  async updateOne(file, data): Promise<File> {
    return this.filesRepository.save({
      ...file,
      ...data
    });
  }

  async deleteOne(file): Promise<DeleteResult> {
    return this.filesRepository.delete(file.id);
  }

  async create(file): Promise<File> {
    return this.filesRepository.save(file);
  }
}
