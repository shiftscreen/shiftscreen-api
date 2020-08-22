import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/users.entity';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'datetime' })
  expiresOn: Date;

  @ManyToOne(type => User, user => user.tokens, {
    onDelete: 'CASCADE'
  })
  user: Promise<User>;
}
