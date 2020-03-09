import { IsNumber, IsString, IsJSON } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import * as GraphQLJSON from 'graphql-type-json';

@InputType()
export class NewSlideInput {
  @Field()
  @IsNumber()
  readonly durationMilliseconds: number;

  @Field()
  @IsNumber()
  readonly index: number;

  @Field()
  @IsString()
  readonly appId: string;

  @Field()
  @IsJSON()
  readonly appConfig: string;

  @Field()
  @IsNumber()
  readonly screenId: number;
}
