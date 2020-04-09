import { IsNumber, IsString, IsJSON, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateSlideInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly durationMilliseconds?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly index?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly appId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsJSON()
  readonly appConfig?: string;
}
