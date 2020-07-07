import { MaxLength, IsString, IsBoolean, IsOptional, IsArray, Matches, IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { SlideInput } from '../../slides/dto/slide.input';
import GraphQLJSON from 'graphql-type-json';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Matches(/^([0-9]{1,2}):[0-9]{1,2}$/)
  readonly ratio?: string;

  @Field(type => GraphQLJSON, { nullable: true })
  @IsOptional()
  readonly slidesOrder?: string;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly organizationId?: number;

  @Field(type => [SlideInput], { nullable: true })
  @IsOptional()
  @IsArray()
  readonly slides?: SlideInput[];
}
