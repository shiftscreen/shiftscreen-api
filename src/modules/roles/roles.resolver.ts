import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Int } from 'type-graphql';

import { PermissionType } from './enums/permission-type.enum';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ErrorsMessages } from '../../constants';

import { Role } from './roles.entity';
import { NewRoleInput } from './dto/new-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { RolesService } from './roles.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';

@UseGuards(GqlAuthGuard)
@Resolver(of => Role)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Mutation(returns => Role)
  async addRole(
    @CurrentUser() user,
    @Args('newRoleData') newRoleData: NewRoleInput,
  ): Promise<Role> {
    const [roleOrganization, roleUser] = await Promise.all([
      this.organizationsService.findOneById(newRoleData.organizationId),
      this.usersService.findOneById(newRoleData.userId),
    ]);

    const currentUserRole = await this.rolesService.findOneUserRole(user, roleOrganization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const roleData: Partial<Role> = {
      permissionType: newRoleData.permissionType,
      user: Promise.resolve(roleUser),
      organization: Promise.resolve(roleOrganization),
    };

    const role = createEntityInstance<Role>(Role, roleData);

    const roleExists = await this.rolesService.findOneByConditions({
      user: { id: newRoleData.userId },
      organization: { id: newRoleData.organizationId },
    });

    if (roleExists) {
      throw new GraphQLError(ErrorsMessages.ROLE_EXISTS);
    }

    return this.rolesService.create(role);
  }

  @Mutation(returns => Role)
  async updateRole(
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateRoleData') updateRoleData: UpdateRoleInput,
  ): Promise<Role> {
    const role = await this.rolesService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await role.organization);

    if ((await role.user) !== (await user) || !currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    return this.rolesService.updateOne(role.id, updateRoleData);
  }

  @Mutation(returns => Boolean)
  async deleteRole(
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const role = await this.rolesService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await role.organization);

    if ((await role.user) !== user || !currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const roles = (await (await role.organization).roles);
    const adminRoles = roles.filter((role: Role) => role.isAdmin());
    const lastAdminRole = adminRoles.length === 1;
    if (lastAdminRole) {
      throw new GraphQLError(ErrorsMessages.LAST_ADMIN_ROLE);
    }

    const deleteResults = await this.organizationsService.deleteOneById(role.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
