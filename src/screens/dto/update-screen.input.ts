import { MaxLength, IsString, IsBoolean } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateScreenInput {
  @Field()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @Field()
  @IsBoolean()
  readonly isActive: boolean;
}
