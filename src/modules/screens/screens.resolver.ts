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
import { Role } from '../roles/roles.entity';
import { PermissionType } from '../roles/enums/permission-type.enum'
import { RolesService } from '../roles/roles.service';
import { SlidesService } from '../slides/slides.service';

import { Screen } from './screens.entity';
import { NewScreenInput } from './dto/new-screen.input';
import { ScreensService } from './screens.service';
import { UpdateScreenInput } from './dto/update-screen.input';
import { OrganizationsService } from '../organizations/organizations.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';

@UseGuards(GqlAuthGuard)
@Resolver(of => Screen)
export class ScreensResolver {
  constructor(
    private readonly screensService: ScreensService,
    private readonly slidesService: SlidesService,
    private readonly organizationsService: OrganizationsService,

    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  @Query(returns => Screen)
  async screen(
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Screen> {
    const screen = await this.screensService.findOneByIdWithRelations(id, ['organization']);
    const currentUserRole = await this.rolesService.findOneUserRole(user, await screen.organization);

    if (!currentUserRole) {
      throw new ForbiddenException();
    }

    return screen;
  }

  @Mutation(returns => Screen)
  async addScreen(
    @CurrentUser() user,
    @Args('newScreenData') newScreenData: NewScreenInput,
  ): Promise<Screen> {
    const [organization, currentUserRole] = await Promise.all([
      this.organizationsService.findOneById(newScreenData.organizationId),
      this.rolesService.findOneUserRole(user, { id: newScreenData.organizationId })
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
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateScreenData') updateScreenData: UpdateScreenInput,
  ): Promise<Screen> {
    const screen = await this.screensService.findOneByIdWithRelations(id, ['organization']);
    const currentUserRole = await this.rolesService.findOneUserRole(user, await screen.organization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    return this.screensService.updateOne(screen.id, updateScreenData);
  }

  @Mutation(returns => Boolean)
  async deleteScreen(
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const screen = await this.screensService.findOneByIdWithRelations(id, ['organization']);
    const currentUserRole = await this.rolesService.findOneUserRole(user, await screen.organization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.screensService.deleteOne(screen.id);
    return deleteResults.affected && deleteResults.affected > 1;
  }
}
