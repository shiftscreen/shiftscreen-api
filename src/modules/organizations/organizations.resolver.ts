import { Resolver, Args, Mutation } from '@nestjs/graphql';
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

@UseGuards(GqlAuthGuard)
@Resolver(of => Organization)
export class OrganizationsResolver {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly rolesService: RolesService,
  ) {}

  @Mutation(returns => Organization)
  async addOrganization(
    @CurrentUser() user,
    @Args('newOrganizationData') newOrganizationData: NewOrganizationInput,
  ): Promise<Organization> {
    const organization = await this.organizationsService.create(newOrganizationData);

    const roleData = {
      permissionType: PermissionType.Admin,
      organization: Promise.resolve(organization),
      user,
    };
    const role = createEntityInstance<Role>(Role, roleData);
    await this.rolesService.create(role);

    return organization;
  }

  @Mutation(returns => Organization)
  async updateOrganization(
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args('updateOrganizationData') updateOrganizationData: UpdateOrganizationInput,
  ): Promise<Organization> {
    const organization = await this.organizationsService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(user, organization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    return this.organizationsService.updateOne(organization.id, updateOrganizationData);
  }


  @Mutation(returns => Boolean)
  async deleteOrganization(
    @CurrentUser() user,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const organization = await this.organizationsService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(user, organization);

    if (!currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    await this.rolesService.deleteOneById(currentUserRole.id);
    const deleteResults = await this.organizationsService.deleteOneById(organization.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
