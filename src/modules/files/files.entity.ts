import {
  Entity,
  Column,
  ManyToOne, OneToMany,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

import { FileKey } from '../files-keys/files-keys.entity';
import { User } from '../users/users.entity';
import { BaseEntity } from '../../shared/base/base.entity';
import { FileLink } from './file-link.entity';

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
  sizeKilobytes: number;

  @Field(type => User)
  @ManyToOne(type => User, user => user.files, {
    onDelete: 'CASCADE'
  })
  user: Promise<User>;

  @Field(type => [FileKey], { nullable: true })
  @OneToMany(type => FileKey, key => key.file, {
    cascade: true,
  })
  keys: Promise<FileKey[]>;

  @Field(type => FileLink)
  link: FileLink;
}
