import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, } from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Int } from 'type-graphql';

import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { RolesService } from '../roles/roles.service';
import { SlidesService } from '../slides/slides.service';

import { Screen } from './screens.entity';
import { NewScreenInput } from './dto/new-screen.input';
import { ScreensService } from './screens.service';
import { UpdateScreenInput } from './dto/update-screen.input';
import { OrganizationsService } from '../organizations/organizations.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { getUpdatedSlides } from './utils/get-updated-slides.util';
import { AppsInstancesService } from '../apps-instances/apps-instances.service';
import { getDeletedSlidesIds } from './utils/get-deleted-slides-ids.util';
import { User } from '../users/users.entity';
import { getFinalSlides } from './utils/get-final-slides';
import { Role } from '../roles/roles.entity';

@UseGuards(GqlAuthGuard)
@Resolver(of => Screen)
export class ScreensResolver {
  constructor(
    private readonly screensService: ScreensService,
    private readonly slidesService: SlidesService,
    private readonly organizationsService: OrganizationsService,
    private readonly appsInstancesService: AppsInstancesService,

    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  @Query(returns => Screen)
  async screen(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Screen> {
    const screen = await this.screensService.findOneByIdWithRelations(id, ['organization']);
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, await screen.organization);

    if (!currentUserRole) {
      throw new ForbiddenException();
    }

    return screen;
  }

  @Mutation(returns => Screen)
  async addScreen(
    @CurrentUser() currentUser: User,
    @Args('newScreenData') newScreenData: NewScreenInput,
  ): Promise<Screen> {
    const [organization, currentUserRole] = await Promise.all([
      this.organizationsService.findOneById(newScreenData.organizationId),
      this.rolesService.findOneUserRole(currentUser, { id: newScreenData.organizationId })
    ]);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const screenData: Partial<Screen> = {
      ...newScreenData,
      organization: Promise.resolve(organization),
    };
    const screen = createEntityInstance<Screen>(Screen, screenData);
    return this.screensService.create(screen);
  }

  @Mutation(returns => Screen)
  async updateScreen(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateScreenData') { organizationId, slides: slidesInput, ...updateScreenData }: UpdateScreenInput,
  ): Promise<Screen> {
    const screen = await this.screensService.findOneByIdWithRelations(id, ['organization', 'slides']);
    const [finalSlides, deletedSlidesIds] = getFinalSlides(await screen.slides, slidesInput);

    const newOrganization = organizationId && await this.organizationsService.findOneById(organizationId);
    if (organizationId) {
      const [currentOrganizationUserRole, newOrganizationUserRole] = await Promise.all([
        this.rolesService.findOneUserRole(currentUser, await screen.organization),
        this.rolesService.findOneUserRole(currentUser, newOrganization),
      ]);

      if (!currentOrganizationUserRole.isAdmin() || !newOrganizationUserRole.isAdmin()) {
        throw new ForbiddenException();
      }
    }

    const updatedSlides = finalSlides ? Promise.resolve(finalSlides) : screen.slides;
    const updatedOrganization = newOrganization ? Promise.resolve(newOrganization) : screen.organization;

    const updatedScreenData: Partial<Screen> = {
      ...updateScreenData,
      slides: updatedSlides,
      organization: updatedOrganization,
    };

    const updatedScreen = Object.assign(screen, updatedScreenData);

    if (deletedSlidesIds && deletedSlidesIds.length > 0) {
      await this.slidesService.deleteManyByIds(deletedSlidesIds)
    }

    return this.screensService.saveOne(updatedScreen);
  }

  @Mutation(returns => Boolean)
  async deleteScreen(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const screen = await this.screensService.findOneByIdWithRelations(id, ['organization']);
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, await screen.organization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.screensService.deleteOneById(screen.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty(returns => Role)
  async viewerRole(
    @Parent() screen: Screen,
    @CurrentUser() currentUser: User,
  ): Promise<Role> {

    return this.rolesService.findOneUserRole(currentUser, await screen.organization);
  }
}
