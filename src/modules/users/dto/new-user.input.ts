import { Length, IsEmail, IsString, IsBoolean, Equals } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Upload } from '../../../shared/scalars/upload.scalar';
import { Exclude } from 'class-transformer';
import { FileUpload } from 'graphql-upload';

@InputType()
export class NewUserInput {
  @Field()
  @IsEmail()
  @Length(6,255)
  readonly email: string;

  @Field()
  @IsString()
  @Length(6, 255)
  password: string;

  @Field()
  @IsString()
  @Length(1, 100)
  readonly firstName: string;

  @Field()
  @IsString()
  @Length(1, 100)
  readonly lastName: string;

  @Field()
  @IsBoolean()
  @Equals(true)
  readonly rulesAccepted: boolean;

  @Exclude()
  @Field(type => Upload, { nullable: true })
  readonly picture: Promise<FileUpload>;
}
