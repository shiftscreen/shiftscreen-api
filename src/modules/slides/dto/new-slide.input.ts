import { IsNumber, IsJSON, Matches, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SlideTransition } from '../interfaces/slide-transition.interface';
import { SlideTime } from '../interfaces/slide-time';
import { SlideDate } from '../interfaces/slide-date';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class NewSlideInput {
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

  @Field()
  @IsNumber()
  readonly appInstanceId: number;

  @Field(type => Int)
  @IsNumber()
  readonly screenId: number;
}
