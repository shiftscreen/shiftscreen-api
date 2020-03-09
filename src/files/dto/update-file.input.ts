import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateFileInput {
  @Field()
  @IsString()
  @Length(1, 255)
  readonly title: string;
}
