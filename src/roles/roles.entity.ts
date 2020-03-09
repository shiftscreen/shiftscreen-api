import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { User } from '../users/users.entity';
import { Screen } from '../screens/screens.entity';
import { PermissionType } from './enums/permission-type.enum';

@Entity({ name: 'roles' })
@ObjectType()
export class Role {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

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
