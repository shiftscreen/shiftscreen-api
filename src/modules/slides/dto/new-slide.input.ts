import { IsNumber, IsString, IsJSON, IsArray, IsUUID } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SlideTransition } from '../interfaces/slide-transition.interface';
import { SlideTime } from '../interfaces/slide-time';
import { SlideDate } from '../interfaces/slide-date';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class NewSlideInput {
  @Field()
  @IsNumber()
  readonly index: number;

  @Field()
  @IsNumber()
  readonly durationMilliseconds: number;

  @Field(type => GraphQLJSON)
  @IsJSON()
  readonly transition: SlideTransition;

  @Field(type => GraphQLJSON)
  @IsJSON()
  readonly time: SlideTime;

  @Field(type => GraphQLJSON)
  @IsJSON()
  readonly date: SlideDate;

  @Field(type => [Int])
  @IsArray()
  readonly weekdays: number[];

  @Field()
  @IsString()
  @IsUUID()
  readonly appInstanceId: string;

  @Field()
  @IsNumber()
  readonly screenId: number;
}
