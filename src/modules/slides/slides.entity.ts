import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Screen } from '../screens/screens.entity';
import { BaseEntity } from '../../shared/base/base.entity';
import { SlideTransition } from './interfaces/slide-transition.interface';

import GraphQLJSON from 'graphql-type-json';
import { SlideTime } from './interfaces/slide-time';
import { SlideDate } from './interfaces/slide-date';
import { AppInstance } from '../apps-instances/apps-instances.entity';

@Entity({ name: 'slides' })
@ObjectType()
export class Slide extends BaseEntity {
  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Int)
  @Column()
  index: number;

  @Field(() => Int)
  @Column()
  durationMilliseconds: number;

  @Field(type => GraphQLJSON)
  @Column({ type: 'json' })
  transition: SlideTransition;

  @Field(type => GraphQLJSON)
  @Column({ type: 'json' })
  time: SlideTime;

  @Field(type => GraphQLJSON)
  @Column({ type: 'json' })
  date: SlideDate;

  @Field(type => GraphQLJSON)
  @Column({ type: 'json' })
  weekdays: number[];

  @ManyToOne(type => AppInstance, appInstance => appInstance.slides)
  appInstance: Promise<AppInstance>;

  @ManyToOne(type => Screen, screen => screen.slides)
  screen: Promise<Screen>;
}
