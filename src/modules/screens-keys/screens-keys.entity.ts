import {
  Entity,
  ManyToOne,
  Column,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { BaseEntity } from '../../shared/base/base.entity';
import { User } from '../users/users.entity';
import { Screen } from '../screens/screens.entity';

@Entity({ name: 'screens_keys' })
@ObjectType()
export class ScreenKey extends BaseEntity {
  @Field({ nullable: true })
  @Column({ length: 16, nullable: true })
  privateKey: string;

  @Field(type => Screen)
  @ManyToOne(type => Screen, screen => screen.keys)
  screen: Promise<Screen>;

  @Field(type => User)
  @ManyToOne(type => User, user => user.files)
  user: Promise<User>;
}
