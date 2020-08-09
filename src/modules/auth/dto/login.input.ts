import { Length, IsEmail, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @Length(6,255)
  readonly email: string;

  @Field()
  @IsString()
  @Length(6, 255)
  readonly password: string;

  @Field()
  @IsString()
  readonly recaptcha: string;
}
