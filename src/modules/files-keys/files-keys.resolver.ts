import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Int } from 'type-graphql';
import * as randomString from 'randomstring';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { FilesService } from '../files/files.service';

import { FileKey } from './files-keys.entity';
import { NewFileKeyInput } from './dto/new-file-key.input';
import { FileKeyInput } from './dto/file-key.input';
import { FilesKeysService } from './files-keys.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';

@Resolver(of => FileKey)
export class FilesKeysResolver {
  constructor(
    private readonly filesKeysService: FilesKeysService,
    private readonly filesService: FilesService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => FileKey)
  async fileKey(
    @CurrentUser() user,
    @Args('fileKey') fileKeyInput: FileKeyInput,
  ): Promise<FileKey> {
    const fileKey = await this.filesKeysService.findOneByConditions(fileKeyInput);

    if (!fileKey) {
      throw new ForbiddenException();
    }

    return fileKey;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => FileKey)
  async addFileKey(
    @CurrentUser() user,
    @Args('newFileKeyData') newFileKeyData: NewFileKeyInput,
  ): Promise<FileKey> {
    const file = await this.filesService.findOneById(newFileKeyData.fileId);
    const userIsAuthor = (await file.user).id === (await user).id;

    if (!userIsAuthor) {
      throw new ForbiddenException();
    }

    const fileKeyData: Partial<FileKey> = {
      key: randomString.generate(32),
      file: Promise.resolve(file),
    };

    const fileKey = createEntityInstance<FileKey>(FileKey, fileKeyData);

    return this.filesKeysService.create(fileKey);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteFileKey(
    @CurrentUser() user,
    @Args( 'id') id: string,
  ): Promise<boolean> {
    const fileKey = await this.filesKeysService.findOneById(id);
    const userIsAuthor = (await fileKey.user).id === (await user).id;

    if (!userIsAuthor) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.filesKeysService.deleteOne(fileKey.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
