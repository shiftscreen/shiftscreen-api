import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { Role } from '../roles/roles.entity';
import { Slide } from '../slides/slides.entity';
import { BaseEntity } from '../../shared/base/base.entity';

@Entity({ name: 'screens' })
@ObjectType()
export class Screen extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(type => [Role], { nullable: true })
  @OneToMany(type => Role, role => role.screen, {
    onDelete: 'CASCADE'
  })
  roles: Promise<Role[]>;

  @Field(type => [Slide], { nullable: true })
  @OneToMany(type => Slide, slide => slide.screen, {
    onDelete: 'CASCADE'
  })
  slides: Promise<Slide[]>;
}
