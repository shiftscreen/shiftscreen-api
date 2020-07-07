import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';

import { RolesService } from '../roles/roles.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ScreensService } from '../screens/screens.service';

import { Slide } from './slides.entity';
import { NewSlideInput } from './dto/new-slide.input';
import { UpdateSlideInput } from './dto/update-slide.input';
import { SlidesService } from './slides.service';
import { AppsInstancesService } from '../apps-instances/apps-instances.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';
import { Int } from 'type-graphql';

@UseGuards(GqlAuthGuard)
@Resolver(of => Slide)
export class SlidesResolver {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly rolesService: RolesService,
    private readonly appsInstancesService: AppsInstancesService,

    @Inject(forwardRef(() => ScreensService))
    private readonly screensService: ScreensService,
  ) {}

  @Mutation(returns => Slide)
  async addSlide(
    @CurrentUser() currentUser: User,
    @Args('newSlideData') newSlideData: NewSlideInput,
  ): Promise<Slide> {
    const [screen, appInstance] = await Promise.all([
      this.screensService.findOneByIdWithRelations(newSlideData.screenId, ['organization']),
      this.appsInstancesService.findOneByIdWithRelations(newSlideData.appInstanceId, ['user'])
    ]);

    const [currentUserRole, appInstanceUser] = await Promise.all([
      await this.rolesService.findOneUserRole(currentUser, await screen.organization),
      await appInstance && appInstance.user,
    ]);

    if (appInstance) {
      const isOwner = appInstanceUser.id === currentUser.id;
      if (!isOwner && !currentUserRole.isAdmin()) {
        throw new ForbiddenException();
      }
    }

    const slideData: Partial<Slide> = {
      ...newSlideData,
      appInstance: Promise.resolve(appInstance),
      screen: Promise.resolve(screen)
    };
    const slide = createEntityInstance<Slide>(Slide, slideData);
    return this.slidesService.create(slide);
  }

  @Mutation(returns => Slide)
  async updateSlide(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateSlideData') updateSlideData: UpdateSlideInput,
  ): Promise<Slide> {
    const [slide, appInstance] = await Promise.all([
      this.slidesService.findOneByIdWithRelations(id, ['screen', 'screen.organization']),
      this.appsInstancesService.findOneByIdWithRelations(updateSlideData.appInstanceId, ['user']),
    ]);
    const screen = await slide.screen;

    const [currentUserRole, appInstanceUser] = await Promise.all([
      await this.rolesService.findOneUserRole(currentUser, await screen.organization),
      await appInstance && appInstance.user,
    ]);

    const isOwner = !appInstance || (appInstanceUser.id === currentUser.id);
    if (!isOwner && !currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    return this.slidesService.updateOne(slide.id, updateSlideData);
  }

  @Mutation(returns => Boolean)
  async deleteSlide(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const slide = await this.slidesService.findOneByIdWithRelations(id, ['screen', 'screen.organization']);
    const screen = await slide.screen;
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, await screen.organization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.slidesService.deleteOneById(id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
