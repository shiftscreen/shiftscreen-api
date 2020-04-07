import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

import { User } from './users.entity';
import { NewUserInput } from './dto/new-user.input';
import { UsersService } from './users.service';
import { StoragesService } from '../storages/storages.service';

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
    return this.usersService.findOneByEmail(email);
  }

  @Mutation(returns => User)
  async addUser(
    @Args('newUserData') newUserData: NewUserInput,
  ): Promise<User> {
    const user = Object.assign(new User(), {
      ...newUserData,
      rulesAcceptedAt: new Date(),
    });

    const userInstance = await this.usersService.create(user);
    await this.storagesService.create({ user: userInstance });
    return userInstance;
  }
}
