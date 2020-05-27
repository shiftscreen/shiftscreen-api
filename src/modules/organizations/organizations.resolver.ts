import { Resolver, Args, Mutation, Query, ResolveProperty, Parent } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Int } from 'type-graphql';

import { PermissionType } from '../roles/enums/permission-type.enum';
import { RolesService } from '../roles/roles.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

import { NewOrganizationInput } from './dto/new-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { Organization } from './organizations.entity';
import { OrganizationsService } from './organizations.service';
import { Role } from '../roles/roles.entity';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';

@UseGuards(GqlAuthGuard)
@Resolver(of => Organization)
export class OrganizationsResolver {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly rolesService: RolesService,
  ) {}

  @Query(returns => Organization)
  async organization(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<Organization> {
    const organization = await this.organizationsService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, organization);

    if (!currentUserRole) {
      throw new ForbiddenException();
    }

    return organization;
  }

  @Mutation(returns => Organization)
  async addOrganization(
    @CurrentUser() currentUser: User,
    @Args('newOrganizationData') newOrganizationData: NewOrganizationInput,
  ): Promise<Organization> {
    const organization = await this.organizationsService.create(newOrganizationData);

    const roleData = {
      permissionType: PermissionType.Admin,
      organization: Promise.resolve(organization),
      user: Promise.resolve(currentUser),
    };
    const role = createEntityInstance<Role>(Role, roleData);
    await this.rolesService.create(role);

    return organization;
  }

  @Mutation(returns => Organization)
  async updateOrganization(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateOrganizationData') updateOrganizationData: UpdateOrganizationInput,
  ): Promise<Organization> {
    const organization = await this.organizationsService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, organization);
    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    return this.organizationsService.updateOne(organization.id, updateOrganizationData);
  }

  @Mutation(returns => Boolean)
  async deleteOrganization(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, { id });

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    await this.rolesService.deleteOneById(currentUserRole.id);
    const deleteResults = await this.organizationsService.deleteOneById(id);
    return deleteResults.affected && deleteResults.affected > 0;
  }

  @ResolveProperty(returns => PermissionType)
  async viewerPermissionType(
    @Parent() organization: Organization,
    @CurrentUser() currentUser: User,
  ): Promise<PermissionType> {
    const currentUserRole = await this.rolesService.findOneUserRole(currentUser, organization);

    return currentUserRole.permissionType;
  }
}
