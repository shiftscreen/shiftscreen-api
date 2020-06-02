import { MaxLength, IsString, IsEnum, IsNumber, Matches } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class NewScreenInput {
  @Field()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @Field()
  @IsString()
  readonly color: string;

  @Field()
  @Matches(/^([0-9]{1,2}):[0-9]{1,2}$/)
  readonly ratio: string;

  @Field(type => Int)
  @IsNumber()
  readonly organizationId: number;
}
