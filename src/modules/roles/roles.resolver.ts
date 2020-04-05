import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { PermissionType } from './enums/permission-type.enum';
import { UsersService } from '../users/users.service';
import { ScreensService } from '../../screens/screens.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ErrorsMessages } from '../../constants';

import { Role } from './roles.entity';
import { NewRoleInput } from './dto/new-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { RolesService } from './roles.service';

@Resolver(of => Role)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly screensService: ScreensService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Role)
  async addRole(
    @CurrentUser() user,
    @Args('newRoleData') newRoleData: NewRoleInput,
  ): Promise<Role> {
    const { permissionType } = newRoleData;
    const roleScreen = await this.screensService.findOneById(newRoleData.screenId);
    const roleUser = await this.usersService.findOneById(newRoleData.userId);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, roleScreen);

    const userIsNotAdmin = !currentUserRole || currentUserRole.permissionType !== PermissionType.Admin;
    if (userIsNotAdmin) {
      throw new ForbiddenException();
    }

    const role = new Role();
    role.permissionType = permissionType;
    role.user = Promise.resolve(roleUser);
    role.screen = Promise.resolve(roleScreen);

    const roleExists = await this.rolesService.findOneByConditions({
      user: {
        id: newRoleData.userId
      },
      screen: {
        id: newRoleData.screenId,
      },
    });
    if (roleExists) {
      throw new GraphQLError(ErrorsMessages.ROLE_EXISTS);
    }

    return this.rolesService.create(role);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Role)
  async updateRole(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('updateRoleData') updateRoleData: UpdateRoleInput,
  ): Promise<Role> {
    const role = await this.rolesService.findOneById(id);
    const roleScreen = await role.screen;
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await roleScreen);

    const userIsNotAdmin = !currentUserRole || currentUserRole.permissionType !== PermissionType.Admin;
    if (userIsNotAdmin) {
      throw new ForbiddenException();
    }

    return this.rolesService.updateOne(role, updateRoleData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteRole(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('updateRoleData') updateRoleData: UpdateRoleInput,
  ): Promise<boolean> {
    const role = await this.rolesService.findOneById(id);
    const roleScreen = await role.screen;
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await roleScreen);

    const userIsNotAdmin = !currentUserRole || currentUserRole.permissionType !== PermissionType.Admin;
    if (userIsNotAdmin) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.rolesService.deleteOne(role);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
