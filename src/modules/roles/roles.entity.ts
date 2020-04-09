import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../users/users.entity';
import { Screen } from '../screens/screens.entity';
import { PermissionType } from './enums/permission-type.enum';
import { BaseEntity } from '../../shared/base/base.entity';

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

  @Field(type => Screen)
  @ManyToOne(type => Screen, screen => screen.roles)
  screen: Promise<Screen>;
}
