import { IsOptional, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateAppInstanceInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly appVersion: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly config: string;
}
