import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from 'type-graphql';

import { User } from '../users/users.entity';
import { File } from '../files/files.entity';

@Entity({ name: 'files_keys' })
@ObjectType()
export class FileKey {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @Column({ length: 32 })
  key: string;

  @Field(type => File)
  @ManyToOne(type => File, file => file.keys)
  file: Promise<File>;

  @Field(type => User)
  @ManyToOne(type => User, user => user.files)
  user: Promise<User>;
}
