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

@UseGuards(GqlAuthGuard)
@Resolver(of => AppInstance)
export class AppsInstancesResolver {
  constructor(
    private readonly appsInstancesService: AppsInstancesService,
  ) {}

  @Mutation(returns => AppInstance)
  async addAppInstance(
    @CurrentUser() user,
    @Args('newAppInstanceData') newAppInstanceData: NewAppInstanceInput,
  ): Promise<AppInstance> {
    const appInstanceData: Partial<AppInstance> = {
      ...newAppInstanceData,
      user,
    };
    const appInstance = createEntityInstance<AppInstance>(AppInstance, appInstanceData);
    return this.appsInstancesService.create(appInstance);
  }

  @Mutation(returns => AppInstance)
  async updateAppInstance(
    @CurrentUser() user,
    @Args('id') id: string,
    @Args('updateAppInstanceData') updateAppInstanceData: UpdateAppInstanceInput,
  ): Promise<AppInstance> {
    const appInstance = await this.appsInstancesService.findOneByIdWithRelations(id, ['user']);

    if (await appInstance.user !== user) {
      throw new ForbiddenException();
    }

    return this.appsInstancesService.updateOne(appInstance.id, updateAppInstanceData);
  }

  @Mutation(returns => Boolean)
  async deleteAppInstance(
    @CurrentUser() user,
    @Args('id') id: string,
  ): Promise<boolean> {
    const appInstance = await this.appsInstancesService.findOneByIdWithRelations(id, ['user']);

    if (await appInstance.user !== user) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.appsInstancesService.deleteOne(appInstance.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
