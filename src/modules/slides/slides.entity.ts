import {
  Entity,
  Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
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
  durationSeconds: number;

  @Field(type => GraphQLJSON, { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  transition?: SlideTransition;

  @Field(type => GraphQLJSON, { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  time?: SlideTime;

  @Field(type => GraphQLJSON, { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  date?: SlideDate;

  @Field(type => GraphQLJSON, { defaultValue: '[]' })
  @Column({ type: 'simple-json', nullable: true })
  weekdays: string;

  @Column({ nullable: true })
  appInstanceId?: number;

  @Field(type => AppInstance, { nullable: true })
  @ManyToOne(type => AppInstance, appInstance => appInstance.slides)
  @JoinColumn({ name: 'appInstanceId' })
  appInstance?: Promise<AppInstance>;

  @ManyToOne(type => Screen,screen => screen.slides, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  screen: Promise<Screen>;
}
