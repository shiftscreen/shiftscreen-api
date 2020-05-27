import { Args, Mutation, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Int } from 'type-graphql';
import * as streamLength from 'stream-length';

import { File } from './files.entity';
import { FileLink } from './file-link.entity';
import { NewFileInput } from './dto/new-file.input';
import { UpdateFileInput } from './dto/update-file.input';
import { FilesService } from './files.service';
import { MinioService } from '../minio/minio.service';
import { StoragesService } from '../storages/storages.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { createUniqueFilename, getUserFilePath } from '../../shared/utils/file-upload.util';
import { ErrorsMessages } from '../../constants';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';
import { RolesService } from '../roles/roles.service';
import { FileKey } from '../files-keys/files-keys.entity';

@Resolver(of => File)
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService,
    private readonly storagesService: StoragesService,
    private readonly minioService: MinioService,
    private readonly rolesService: RolesService,
  ) {
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => File, { nullable: true })
  async addFile(
    @Args('newFileData') newFileData: NewFileInput,
    @CurrentUser() currentUser: User,
  ): Promise<File> {
    const newFile = await newFileData.file;
    const fileSize = await streamLength(newFile.createReadStream());
    const fileSizeKilobytes = Math.round(fileSize / 1000);
    const filename = createUniqueFilename(newFile);
    const filePath = getUserFilePath(currentUser, filename);

    const userStorage = await currentUser.storage;
    const storageUsedAfterUpload = userStorage.usedKilobytes + fileSizeKilobytes;
    const notEnoughSpace = storageUsedAfterUpload > userStorage.maxKilobytes;

    if (notEnoughSpace) {
      throw new GraphQLError(ErrorsMessages.NOT_ENOUGH_SPACE);
    }

    await Promise.all([
      this.minioService.uploadFileToFilePath(newFile, filePath),
      this.storagesService.increaseUsed(userStorage, fileSizeKilobytes),
    ]);

    const fileData: Partial<File> = {
      title: newFileData.title,
      mimeType: newFile.mimetype,
      sizeKilobytes: fileSizeKilobytes,
      user: Promise.resolve(currentUser),
      filename,
    };
    const file = createEntityInstance<File>(File, fileData);
    return this.filesService.create(file);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => File, { nullable: true })
  async updateFile(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateFileData') updateFileData: UpdateFileInput,
  ): Promise<File> {
    const file = await this.filesService.findOneByIdAndOwner(id, currentUser);
    if (!file) {
      throw new ForbiddenException();
    }

    return this.filesService.updateOne(file.id, updateFileData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteFile(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const file = await this.filesService.findOneByIdAndOwner(id, currentUser);
    if (!file) {
      throw new ForbiddenException();
    }

    const filePath = getUserFilePath(currentUser, file.filename);
    await this.minioService.deleteFileFromFilePath(filePath);

    const userStorage = await currentUser.storage;
    await this.storagesService.decreaseUsed(userStorage, file.sizeKilobytes);

    const deleteResults = await this.filesService.deleteOneById(file.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => FileLink)
  async fileLink(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<FileLink> {
    const file = await this.filesService.findOneByIdAndOwner(id, currentUser);
    if (!file) {
      throw new ForbiddenException();
    }

    const filePath = getUserFilePath(currentUser, file.filename);
    const { expiryTime } = this.minioService;
    const url = await this.minioService.getPresignedUrl(filePath);

    return {
      url,
      expiryTime
    }
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => User)
  async user(
    @Parent() file: File,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const fileUser = await file.user;
    const isOwner = fileUser.id === currentUser.id;
    if (!isOwner) {
      throw new ForbiddenException();
    }

    return fileUser;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => [FileKey])
  async keys(
    @Parent() file: File,
    @CurrentUser() currentUser: User,
  ): Promise<FileKey[]> {
    const fileUser = await file.user;
    const isOwner = fileUser.id === currentUser.id;
    if (!isOwner) {
      throw new ForbiddenException();
    }

    return file.keys;
  }

  @ResolveProperty(returns => FileLink)
  async link(
    @Parent() file: File,
    @CurrentUser() currentUser: User,
  ): Promise<FileLink> {
    const { filename } = file;
    const filePath = getUserFilePath(await file.user, filename);

    const { expiryTime } = this.minioService;
    const url = await this.minioService.getPresignedUrl(filePath);

    return {
      url,
      expiryTime
    }
  }
}
