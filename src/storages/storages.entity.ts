import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from '../users/users.entity';

@Entity({ name: 'storages' })
@ObjectType()
export class Storage {
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
  @Column()
  usedKilobytes: number;

  @Field()
  @Column()
  maxKilobytes: number;

  @Field(type => User)
  @OneToOne(type => User, user => user.storage)
  user: User;
}
