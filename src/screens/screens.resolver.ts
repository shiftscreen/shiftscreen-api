import {
  Resolver,
  Args,
  Mutation,
  Query,
} from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';

import { Screen } from './screens.entity';
import { NewScreenInput } from './dto/new-screen.input';
import { ScreensService } from './screens.service';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../shared/guards/gql-auth.guard';
import { Role } from '../modules/roles/roles.entity';
import { PermissionType } from '../modules/roles/enums/permission-type.enum'
import { RolesService } from '../modules/roles/roles.service';
import { SlidesService } from '../modules/slides/slides.service';
import { UpdateScreenInput } from './dto/update-screen.input';

@Resolver(of => Screen)
export class ScreensResolver {
  constructor(
    private readonly screensService: ScreensService,
    private readonly slidesService: SlidesService,

    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => Screen)
  async screen(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<Screen> {
    const screen = await this.screensService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, screen);

    const userIsNotAdmin = !currentUserRole || currentUserRole.permissionType !== PermissionType.Admin;
    if (userIsNotAdmin) {
      throw new ForbiddenException();
    }

    return screen;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Screen)
  async addScreen(
    @CurrentUser() user,
    @Args('newScreenData') newScreenData: NewScreenInput,
  ): Promise<Screen> {
    const screen = await this.screensService.create(newScreenData);

    const role = new Role();
    role.permissionType = PermissionType.Admin;
    role.user = user;
    role.screen = Promise.resolve(screen);

    await this.rolesService.create(await role);
    return screen;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Screen)
  async updateScreen(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('updateScreenData') updateScreenData: UpdateScreenInput,
  ): Promise<Screen> {
    const screen = this.screensService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await screen);

    const userIsNotAdmin = !currentUserRole || currentUserRole.permissionType !== PermissionType.Admin;
    if (userIsNotAdmin) {
      throw new ForbiddenException();
    }

    return this.screensService.updateOne(screen, updateScreenData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteScreen(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<boolean> {
    const screen = this.screensService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await screen);

    const userIsNotAdmin = !currentUserRole || currentUserRole.permissionType !== PermissionType.Admin;
    if (userIsNotAdmin) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.screensService.deleteOne(screen);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
