import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column, OneToMany,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from 'type-graphql';

import { User } from '../users/users.entity';
import { Slide } from '../slides/slides.entity';
import { BaseEntity } from '../../shared/base/base.entity';

@Entity({ name: 'apps_instances' })
@ObjectType()
export class AppInstance extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  appId: string;

  @Field()
  @Column()
  appVersion: string;

  @Field()
  @Column({ length: 5000 })
  config: string;

  @Field(type => User)
  @ManyToOne(type => User, user => user.appsInstances, {
    onDelete: 'CASCADE'
  })
  user: Promise<User>;

  @Field(type => [Slide], { nullable: true })
  @OneToMany(type => Slide, slide => slide.appInstance, {
    cascade: true,
  })
  slides: Promise<Slide[]>;
}
