import { IsNumber, IsBoolean, IsJSON, Matches, IsOptional, IsUUID, IsString } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import GraphQLJSON from 'graphql-type-json';

import { SlideTransition } from '../interfaces/slide-transition.interface';
import { SlideTime } from '../interfaces/slide-time';
import { SlideDate } from '../interfaces/slide-date';

@InputType()
export class SlideInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @Field()
  @IsBoolean()
  readonly isActive: boolean;

  @Field(type => Int)
  @IsNumber()
  readonly index: number;

  @Field(type => Int)
  @IsNumber()
  readonly durationMilliseconds: number;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsJSON()
  readonly transition?: SlideTransition;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsJSON()
  readonly time?: SlideTime;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsJSON()
  readonly date?: SlideDate;

  @Field(type => GraphQLJSON)
  @IsJSON()
  @Matches(/^\[([0-6],?){0,7}]$/)
  readonly weekdays: string;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly appInstanceId?: number;
}
