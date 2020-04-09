import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { Role } from '../roles/roles.entity';
import { File } from '../files/files.entity';
import { Storage } from '../storages/storages.entity';
import { BaseEntity } from '../../shared/base/base.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  @Field()
  @Column()
  email: string;

  @Field()
  @Column({ length: 100 })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  lastName: string;

  @Column()
  password: string;

  @Field()
  @Column({ type: 'timestamp' })
  rulesAcceptedAt: Date;

  @Field(type => Storage)
  @OneToOne(type => Storage, storage => storage.user, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  storage: Promise<Storage>;

  @Field(type => [Role], { nullable: true })
  @OneToMany(type => Role, role => role.user, {
    onDelete: 'CASCADE'
  })
  roles: Promise<Role[]>;

  @Field(type => [File], { nullable: true })
  @OneToMany(type => File, file => file.user, {
    onDelete: 'CASCADE'
  })
  files: Promise<File[]>;
}
