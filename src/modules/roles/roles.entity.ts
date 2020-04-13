import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../users/users.entity';
import { PermissionType } from './enums/permission-type.enum';
import { BaseEntity } from '../../shared/base/base.entity';
import { Organization } from '../organizations/organizations.entity';

@Entity({ name: 'roles' })
@ObjectType()
export class Role extends BaseEntity {
  @Field(type => PermissionType)
  @Column({
    type: 'enum',
    enum: PermissionType,
  })
  permissionType: PermissionType;

  @Field(type => User)
  @ManyToOne(type => User, user => user.roles)
  user: Promise<User>;

  @Field(type => Organization)
  @ManyToOne(type => Organization, organization => organization.roles)
  organization: Promise<Organization>;

  public isAdmin(): boolean {
    return this.permissionType === PermissionType.Admin;
  }
}
