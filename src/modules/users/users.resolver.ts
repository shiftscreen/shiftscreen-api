import { Query, Resolver, Args, Mutation, ResolveProperty, Parent } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

import { User } from './users.entity';
import { NewUserInput } from './dto/new-user.input';
import { UsersService } from './users.service';
import { StoragesService } from '../storages/storages.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { getUserFilePath } from '../../shared/utils/file-upload.util';
import { FileLink } from '../files/file-link.entity';
import { File } from '../files/files.entity';

@Resolver(of => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly storagesService: StoragesService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => User)
  async viewer(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findOneById(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => User)
  async user(
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<User> {
    return this.usersService.findOneByConditions({ email });
  }

  @Mutation(returns => User)
  async addUser(
    @Args('newUserData') newUserData: NewUserInput,
  ): Promise<User> {
    const user = createEntityInstance<User>(User, newUserData);
    await user.hashPassword();

    const userInstance = await this.usersService.create(user);
    await this.storagesService.create({ user: userInstance });
    return userInstance;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => [File])
  async files(
    @Parent() user: User,
    @CurrentUser() currentUser: User,
  ): Promise<File[]> {
    if (!currentUser || user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return user.files;
  }
}
