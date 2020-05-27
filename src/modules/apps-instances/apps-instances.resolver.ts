import {
  Resolver,
  Args,
  Mutation,
  Query,
} from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Int } from 'type-graphql';

import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { AppsInstancesService } from './apps-instances.service';
import { AppInstance } from './apps-instances.entity';
import { NewAppInstanceInput } from './dto/new-app-instance.input';
import { UpdateAppInstanceInput } from './dto/update-app-instance.input';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';

@UseGuards(GqlAuthGuard)
@Resolver(of => AppInstance)
export class AppsInstancesResolver {
  constructor(
    private readonly appsInstancesService: AppsInstancesService,
  ) {}

  @Mutation(returns => AppInstance)
  async addAppInstance(
    @CurrentUser() currentUser: User,
    @Args('newAppInstanceData') newAppInstanceData: NewAppInstanceInput,
  ): Promise<AppInstance> {
    const appInstanceData: Partial<AppInstance> = {
      ...newAppInstanceData,
      user: Promise.resolve(currentUser),
    };
    const appInstance = createEntityInstance<AppInstance>(AppInstance, appInstanceData);
    return this.appsInstancesService.create(appInstance);
  }

  @Mutation(returns => AppInstance)
  async updateAppInstance(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateAppInstanceData') updateAppInstanceData: UpdateAppInstanceInput,
  ): Promise<AppInstance> {
    const appInstance = await this.appsInstancesService.findOneByIdAndOwner(id, currentUser);
    if (!appInstance) {
      throw new ForbiddenException();
    }

    return this.appsInstancesService.updateOne(appInstance.id, updateAppInstanceData);
  }

  @Mutation(returns => Boolean)
  async deleteAppInstance(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const appInstance = await this.appsInstancesService.findOneByIdAndOwner(id, currentUser);
    if (!appInstance) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.appsInstancesService.deleteOneById(appInstance.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => AppInstance)
  async appInstance(
    @Args({ name: 'id', type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<AppInstance> {
    const appInstance = await this.appsInstancesService.findOneByIdAndOwner(id, currentUser);
    if (!appInstance) {
      throw new ForbiddenException();
    }

    return appInstance;
  }
}
