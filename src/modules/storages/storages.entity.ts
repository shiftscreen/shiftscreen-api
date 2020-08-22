import {
  Entity,
  Column,
  OneToOne,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { User } from '../users/users.entity';
import { BaseEntity } from '../../shared/base/base.entity';

@Entity({ name: 'storages' })
@ObjectType()
export class Storage extends BaseEntity {
  @Field(() => Int)
  @Column({ default: 0 })
  usedKilobytes: number;

  @Field(() => Int)
  @Column({ default: 0 })
  maxKilobytes: number;

  @Field(type => User)
  @OneToOne(type => User, user => user.storage, {
    onDelete: 'CASCADE'
  })
  user: User;
}
