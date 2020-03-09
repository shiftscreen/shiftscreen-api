import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { FileLink } from './file-link.entity';
import { User } from '../users/users.entity';

@Entity({ name: 'files' })
@ObjectType()
export class File {
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
  title: string;

  @Field()
  @Column()
  filename: string;

  @Field()
  @Column()
  mimeType: string;

  @Field()
  @Column()
  sizeBytes: number;

  @Field(type => User)
  @ManyToOne(type => User, user => user.files)
  user: Promise<User>;

  @Field(type => FileLink)
  link: FileLink;
}
