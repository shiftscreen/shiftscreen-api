import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Role } from '../roles/roles.entity';
import { Slide } from '../slides/slides.entity';

@Entity({ name: 'screens' })
@ObjectType()
export class Screen {
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
