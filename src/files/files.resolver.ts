import {Args, Mutation, Parent, ResolveProperty, Resolver} from '@nestjs/graphql';
import {ForbiddenException, UseGuards} from '@nestjs/common';
import {GraphQLError} from 'graphql';
import * as streamLength from 'stream-length';

import {File} from './files.entity';
import {FileLink} from './file-link.entity';
import {NewFileInput} from './dto/new-file.input';
import {UpdateFileInput} from './dto/update-file.input';
import {FilesService} from './files.service';
import {MinioService} from '../minio/minio.service';
import {StoragesService} from '../storages/storages.service';
import {CurrentUser} from '../shared/decorators/current-user.decorator';
import {GqlAuthGuard} from '../shared/guards/gql-auth.guard';
import {createUniqueFilename, getUserFilePath} from '../shared/utils/file-upload.util';
import {ErrorsMessages} from '../constants';

@Resolver(of => File)
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService,
    private readonly storagesService: StoragesService,
    private readonly minioService: MinioService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => File, { nullable: true })
  async addFile(
    @Args('newFileData') newFileData: NewFileInput,
    @CurrentUser() user,
  ): Promise<File> {
    const newFile = await newFileData.file;
    const fileSize = await streamLength(newFile.createReadStream());
    const fileSizeKilobytes = fileSize / 1000;
    const filename = createUniqueFilename(newFile);
    const filePath = getUserFilePath(await user, filename);

    const userStorage = await user.storage;
    const storageUsedAfterUpload = userStorage.usedKilobytes + fileSizeKilobytes;
    const notEnoughSpace = storageUsedAfterUpload > userStorage.maxKilobytes;

    if (notEnoughSpace) {
      throw new GraphQLError(ErrorsMessages.NOT_ENOUGH_SPACE);
    }

    await this.minioService.uploadFileToFilePath(newFile, filePath);
    await this.storagesService.increaseUsed(userStorage, fileSizeKilobytes);

    const file = new File();
    file.title = newFileData.title;
    file.mimeType = newFile.mimetype;
    file.filename = filename;
    file.sizeBytes = fileSize;
    file.user = user;

    return this.filesService.create(file);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => File, { nullable: true })
  async updateFile(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('updateFileData') updateFileData: UpdateFileInput,
  ): Promise<File> {
    const file = await this.filesService.findOneById(id);
    const userIsAuthor = (await file.user).id === (await user).id;
    if (!userIsAuthor) {
      throw new ForbiddenException();
    }

    return this.filesService.updateOne(file, updateFileData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteFile(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<boolean> {
    const file = await this.filesService.findOneById(id);
    const userIsAuthor = (await file.user).id === (await user).id;
    if (!userIsAuthor) {
      throw new ForbiddenException();
    }

    const filePath = getUserFilePath(await user, file.filename);
    await this.minioService.deleteFileFromFilePath(filePath);

    const userStorage = await user.storage;
    const fileSizeKilobytes = file.sizeBytes / 1000;
    await this.storagesService.decreaseUsed(userStorage, fileSizeKilobytes);

    const deleteResults = await this.filesService.deleteOne(file);
    return deleteResults.affected && deleteResults.affected > 0;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => FileLink)
  async link(
    @Parent() file: File,
    @CurrentUser() user,
  ): Promise<FileLink> {
    const { filename } = file;
    const filePath = getUserFilePath(await user, filename);

    const { expiryTime } = this.minioService;
    const url = await this.minioService.getPresignedUrl(filePath);

    return {
      url,
      expiryTime
    }
  }
}
