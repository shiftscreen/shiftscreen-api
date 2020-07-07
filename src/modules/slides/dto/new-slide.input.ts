import { IsNumber, Matches, IsOptional } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SlideTransition } from '../interfaces/slide-transition.interface';
import { SlideTime } from '../interfaces/slide-time';
import { SlideDate } from '../interfaces/slide-date';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class NewSlideInput {
  @Field(type => Int)
  @IsNumber()
  readonly durationSeconds: number;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly transition?: SlideTransition;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly time?: SlideTime;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly date?: SlideDate;

  @Field(type => GraphQLJSON)
  readonly weekdays: string;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly appInstanceId?: number;

  @Field(type => Int)
  @IsNumber()
  readonly screenId: number;
}
