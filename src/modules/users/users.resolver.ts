import { Query, Resolver, Args, Mutation, ResolveProperty, Parent } from '@nestjs/graphql';
import { BadRequestException, ForbiddenException, UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { NewUserInput } from './dto/new-user.input';
import { UsersService } from './users.service';
import { StoragesService } from '../storages/storages.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { File } from '../files/files.entity';
import { Storage } from '../storages/storages.entity';
import { Role } from '../roles/roles.entity';
import { AppInstance } from '../apps-instances/apps-instances.entity';
import { Int } from 'type-graphql';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from '../auth/auth.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly storagesService: StoragesService,
    private readonly authService: AuthService,
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
    const captchaValid = await this.authService.validateReCaptcha(newUserData.recaptcha);
    if (!captchaValid) {
      throw new BadRequestException();
    }

    const user = createEntityInstance<User>(User, newUserData);
    await user.hashPassword();
    const userInstance = await this.usersService.create(user);

    const storage = createEntityInstance<Storage>(Storage, { user: userInstance });
    await this.storagesService.create(storage);

    return userInstance;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => User)
  async updateUser(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateUserData') { oldPassword, ...updateUserData }: UpdateUserInput,
  ): Promise<User> {
    const notAllowed = id !== currentUser.id;
    const correctPassword = !oldPassword || await currentUser.compareHash(oldPassword);

    if (notAllowed || !correctPassword) {
      throw new ForbiddenException();
    }

    if (updateUserData.password) {
      updateUserData.password = await bcrypt.hash(updateUserData.password, User.saltRounds);
    }

    return this.usersService.updateOne(id, updateUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteUser(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<boolean> {
    const notAllowed = id !== currentUser.id;
    const correctPassword = password && await currentUser.compareHash(password);

    if (notAllowed || !correctPassword) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.usersService.deleteOneById(currentUser.id);
    return deleteResults.affected && deleteResults.affected > 0;
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
  async appsInstances(
    @Parent() user: User,
    @CurrentUser() currentUser: User,
  ): Promise<AppInstance[]> {
    if (user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return user.appsInstances;
  }
}
