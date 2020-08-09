import { Length, IsEmail, IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @Length(6,255)
  readonly email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(6, 255)
  oldPassword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(6, 255)
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  readonly firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  readonly lastName?: string;
}
