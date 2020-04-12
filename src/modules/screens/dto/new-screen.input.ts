import { MaxLength, IsString, IsEnum, IsNumber, Matches } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ScreenColor } from '../enums/screen-color.enum';

@InputType()
export class NewScreenInput {
  @Field()
  @IsString()
  @MaxLength(255)
  readonly title: string;

  @Field(type => ScreenColor)
  @IsEnum(ScreenColor)
  readonly color: ScreenColor;

  @Field()
  @Matches(/^([0-9]{1,2}):[0-9]{1,2}$/)
  readonly ratio: string;

  @Field(type => Int)
  @IsNumber()
  readonly organizationId: number;
}
