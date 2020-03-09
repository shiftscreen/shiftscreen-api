import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Screen } from '../screens/screens.entity';

@Entity({ name: 'slides' })
@ObjectType()
export class Slide {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column()
  durationMilliseconds: number;

  @Field()
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
