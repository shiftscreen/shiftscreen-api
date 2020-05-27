import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';

import { RolesService } from '../roles/roles.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ScreensService } from '../screens/screens.service';

import { Slide } from './slides.entity';
import { NewSlideInput } from './dto/new-slide.input';
import { SlidesService } from './slides.service';
import { AppsInstancesService } from '../apps-instances/apps-instances.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';

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
      await appInstance.user,
    ]);

    const isOwner = appInstanceUser.id === currentUser.id;
    if (!isOwner && !currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const slideData: Partial<Slide> = {
      ...newSlideData,
      appInstance: Promise.resolve(appInstance),
      screen: Promise.resolve(screen)
    };
    const slide = createEntityInstance<Slide>(Slide, slideData);
    return this.slidesService.create(slide);
  }
}
