import { IsNumber, IsString, IsJSON } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateSlideInput {
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
}
