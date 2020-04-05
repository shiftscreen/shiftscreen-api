import { IsString, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Upload } from '../../../shared/scalars/upload.scalar';
import { Exclude } from 'class-transformer';
import { FileUpload } from 'graphql-upload';

@InputType()
export class NewFileInput {
  @Field()
  @IsString()
  @Length(1, 255)
  readonly title: string;

  @Exclude()
  @Field(type => Upload)
  readonly file: Promise<FileUpload>;
}
