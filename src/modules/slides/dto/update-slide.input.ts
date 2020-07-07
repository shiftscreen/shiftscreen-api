import { IsNumber, IsBoolean, Matches, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';

import { SlideTransition } from '../interfaces/slide-transition.interface';
import { SlideTime } from '../interfaces/slide-time';
import { SlideDate } from '../interfaces/slide-date';

@InputType()
export class UpdateSlideInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly durationSeconds?: number;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly transition?: SlideTransition;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly time?: SlideTime;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly date?: SlideDate;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly weekdays?: string;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly appInstanceId?: number;
}
