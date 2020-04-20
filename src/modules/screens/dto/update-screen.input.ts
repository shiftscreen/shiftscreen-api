import { MaxLength, IsString, IsBoolean, IsOptional, IsArray, Matches, IsEnum, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { ScreenColor } from '../enums/screen-color.enum';
import { SlideInput } from '../../slides/dto/slide.input';

@InputType()
export class UpdateScreenInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @Field(type => ScreenColor, { nullable: true })
  @IsOptional()
  @IsEnum(ScreenColor)
  readonly color?: ScreenColor;

  @Field({ nullable: true })
  @IsOptional()
  @Matches(/^([0-9]{1,2}):[0-9]{1,2}$/)
  readonly ratio?: string;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly organizationId: number;

  @Field(type => [SlideInput], { nullable: true })
  @IsOptional()
  @IsArray()
  readonly slides?: SlideInput[];
}
