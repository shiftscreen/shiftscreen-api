import { MaxLength, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class NewScreenInput {
  @Field()
  @IsString()
  @MaxLength(255)
  readonly title: string;
}
