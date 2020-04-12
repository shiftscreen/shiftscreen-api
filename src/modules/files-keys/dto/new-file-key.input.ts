import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class NewFileKeyInput {
  @Field(type => Int)
  readonly fileId: number;
}
