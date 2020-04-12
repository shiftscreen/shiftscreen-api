import {
  Entity,
  Column,
  OneToMany, ManyToOne,
} from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

import { Slide } from '../slides/slides.entity';
import { BaseEntity } from '../../shared/base/base.entity';
import { Organization } from '../organizations/organizations.entity';
import { ScreenColor } from './enums/screen-color.enum';

@Entity({ name: 'screens' })
@ObjectType()
export class Screen extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(type => ScreenColor)
  @Column({
    type: 'enum',
    enum: ScreenColor
  })
  color: ScreenColor;

  @Field()
  @Column()
  ratio: string;

  @Field(type => Organization)
  @ManyToOne(type => Organization, organization => organization.roles)
  organization: Promise<Organization>;

  @Field(type => [Slide], { nullable: true })
  @OneToMany(type => Slide, slide => slide.screen, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  slides: Promise<Slide[]>;
}
