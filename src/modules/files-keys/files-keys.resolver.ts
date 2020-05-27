import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Int } from 'type-graphql';
import * as randomString from 'randomstring';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { FilesService } from '../files/files.service';

import { FileKey } from './files-keys.entity';
import { FileKeyInput } from './dto/file-key.input';
import { FilesKeysService } from './files-keys.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';

@Resolver(of => FileKey)
export class FilesKeysResolver {
  constructor(
    private readonly filesKeysService: FilesKeysService,
    private readonly filesService: FilesService,
  ) {}

  @Query(returns => FileKey)
  async fileKey(
    @Args('fileKey') fileKeyInput: FileKeyInput,
  ): Promise<FileKey> {
    return this.filesKeysService.findOneByConditions(fileKeyInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => FileKey)
  async addFileKey(
    @CurrentUser() currentUser: User,
    @Args({ name: 'fileId', type: () => Int }) fileId: number,
  ): Promise<FileKey> {
    const file = await this.filesService.findOneByIdAndOwner(fileId, currentUser);
    if (!file) {
      throw new ForbiddenException();
    }

    const fileKeyData: Partial<FileKey> = {
      key: randomString.generate(32),
      file: Promise.resolve(file),
      user: Promise.resolve(currentUser),
    };
    const fileKey = createEntityInstance<FileKey>(FileKey, fileKeyData);

    return this.filesKeysService.create(fileKey);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteFileKey(
    @CurrentUser() currentUser: User,
    @Args( 'id') id: string,
  ): Promise<boolean> {
    const fileKey = await this.filesKeysService.findOneByIdAndOwner(id, currentUser);
    if (!fileKey) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.filesKeysService.deleteOneById(fileKey.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
