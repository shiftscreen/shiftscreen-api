import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { File } from './files.entity';

@Injectable()
export class FilesService extends BaseService<File> {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {
    super(filesRepository);
  }
}
