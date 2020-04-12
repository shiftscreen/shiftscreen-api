import { Length, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class NewAppInstanceInput {
  @Field()
  @IsString()
  readonly title: string;

  @Field()
  @IsString()
  readonly appId: string;

  @Field()
  @IsString()
  readonly appVersion: string;

  @Field()
  @IsString()
  readonly config: string;
}
