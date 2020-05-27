import { Query, Resolver, Args, Mutation, ResolveProperty, Parent } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

import { User } from './users.entity';
import { NewUserInput } from './dto/new-user.input';
import { UsersService } from './users.service';
import { StoragesService } from '../storages/storages.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { File } from '../files/files.entity';
import { Storage } from '../storages/storages.entity';
import { Role } from '../roles/roles.entity';
import { AppInstance } from '../apps-instances/apps-instances.entity';

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
  async userByEmail(
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Mutation(returns => User)
  async addUser(
    @Args('newUserData') newUserData: NewUserInput,
  ): Promise<User> {
    const user = createEntityInstance<User>(User, newUserData);
    await user.hashPassword();
    const userInstance = await this.usersService.create(user);

    const storage = createEntityInstance<Storage>(Storage, { user: userInstance });
    await this.storagesService.create(storage);

    return userInstance;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => Storage)
  async storage(
    @Parent() user: User,
    @CurrentUser() currentUser: User,
  ): Promise<Storage> {
    if (user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return user.storage;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => [Role])
  async roles(
    @Parent() user: User,
    @CurrentUser() currentUser: User,
  ): Promise<Role[]> {
    if (user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return user.roles;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => [File])
  async files(
    @Parent() user: User,
    @CurrentUser() currentUser: User,
  ): Promise<File[]> {
    if (user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return user.files;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => [AppInstance])
  async appInstances(
    @Parent() user: User,
    @CurrentUser() currentUser: User,
  ): Promise<AppInstance[]> {
    if (user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return user.appsInstances;
  }
}
