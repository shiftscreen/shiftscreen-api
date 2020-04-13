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

@UseGuards(GqlAuthGuard)
@Resolver(of => FileKey)
export class FilesKeysResolver {
  constructor(
    private readonly filesKeysService: FilesKeysService,
    private readonly filesService: FilesService,
  ) {}

  @Query(returns => FileKey)
  async fileKey(
    @CurrentUser() user,
    @Args('fileKey') fileKeyInput: FileKeyInput,
  ): Promise<FileKey> {
    return this.filesKeysService.findOneByConditions(fileKeyInput);
  }

  @Mutation(returns => FileKey)
  async addFileKey(
    @CurrentUser() user,
    @Args('newFileKeyData') newFileKeyData: NewFileKeyInput,
  ): Promise<FileKey> {
    const file = await this.filesService.findOneByIdWithRelations(
      newFileKeyData.fileId,
      ['user']
    );
    const userIsAuthor = (await file.user).id === user.id;

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

  @Mutation(returns => Boolean)
  async deleteFileKey(
    @CurrentUser() user,
    @Args( 'id') id: string,
  ): Promise<boolean> {
    const fileKey = await this.filesKeysService.findOneByIdWithRelations(id, ['user']);
    const userIsAuthor = (await fileKey.user).id === user.id;

    if (!userIsAuthor) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.filesKeysService.deleteOne(fileKey.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
