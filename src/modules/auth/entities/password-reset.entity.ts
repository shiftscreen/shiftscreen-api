import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/users.entity';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity({ name: 'password_resets' })
export class PasswordReset extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'datetime' })
  expiresOn: Date;

  @ManyToOne(type => User, user => user.passwordResets, {
    onDelete: 'CASCADE'
  })
  user: Promise<User>;
}
