import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from '../../shared/base/base.entity';
import { Role } from '../roles/roles.entity';
import { Screen } from '../screens/screens.entity';

@Entity({ name: 'organizations' })
@ObjectType()
export class Organization extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field(type => [Role], { nullable: true })
  @OneToMany(type => Role, role => role.organization, {
    onDelete: 'CASCADE'
  })
  roles: Promise<Role[]>;

  @Field(type => [Screen], { nullable: true })
  @OneToMany(type => Screen, screen => screen.organization, {
    onDelete: 'CASCADE'
  })
  screens: Promise<Screen[]>;
}