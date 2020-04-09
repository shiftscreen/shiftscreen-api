import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

import { FileLink } from './file-link.entity';
import { User } from '../users/users.entity';
import { BaseEntity } from '../../shared/base/base.entity';

@Entity({ name: 'files' })
@ObjectType()
export class File extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  filename: string;

  @Field()
  @Column()
  mimeType: string;

  @Field(() => Int)
  @Column()
  sizeBytes: number;

  @Field(type => User)
  @ManyToOne(type => User, user => user.files)
  user: Promise<User>;

  @Field(type => FileLink)
  link: FileLink;
}
