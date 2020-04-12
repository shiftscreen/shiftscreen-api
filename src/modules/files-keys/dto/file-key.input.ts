import { Field, InputType } from 'type-graphql';

@InputType()
export class FileKeyInput {
  @Field()
  readonly id: string;

  @Field()
  readonly key: string;
}
