import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../shared/base/base.service';
import { FileKey } from './files-keys.entity';
import { User } from '../users/users.entity';

@Injectable()
export class FilesKeysService extends BaseService<FileKey> {
  constructor(
    @InjectRepository(FileKey)
    private readonly filesKeysRepository: Repository<FileKey>,
  ) {
    super(filesKeysRepository);
  }

  async findOneByIdAndOwner(id: number | string, user: User): Promise<FileKey> {
    return this.filesKeysRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        }
      },
    });
  }
}
