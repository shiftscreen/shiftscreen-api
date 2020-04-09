import { MaxLength, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

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
}
