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

import * as bcrypt from 'bcrypt';
import { AppInstance } from '../apps-instances/apps-instances.entity';
import { Token } from '../auth/entities/token.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  public static saltRounds = 10;

  @Field()
  @Column({ unique: true })
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
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rulesAcceptedAt: Date;

  @Field(type => Storage)
  @OneToOne(type => Storage, storage => storage.user, {
    onDelete: 'CASCADE',
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

  @Field(type => [AppInstance], { nullable: true })
  @OneToMany(type => AppInstance, appInstance => appInstance.user, {
    onDelete: 'CASCADE'
  })
  appsInstances: Promise<AppInstance[]>;

  @OneToMany(type => Token, token => token.user, {
    onDelete: 'CASCADE'
  })
  tokens: Promise<Token[]>;

  hidePassword(): void {
    this.password = undefined;
  }

  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, User.saltRounds);
  }

  async compareHash(password: string | undefined): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
