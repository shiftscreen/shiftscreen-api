import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Screen } from '../screens/screens.entity';
import { BaseEntity } from '../../shared/base/base.entity';

@Entity({ name: 'slides' })
@ObjectType()
export class Slide extends BaseEntity {
  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => Int)
  @Column()
  durationMilliseconds: number;

  @Field(() => Int)
  @Column()
  index: number;

  @Field()
  @Column()
  appId: string;

  @Field()
  @Column()
  appVersion: string;

  @Field()
  @Column({ length: 5000 })
  appConfig: string;

  @ManyToOne(type => Screen, screen => screen.slides)
  screen: Promise<Screen>;
}
