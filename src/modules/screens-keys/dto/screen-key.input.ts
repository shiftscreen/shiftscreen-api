import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ScreenKeyInput {
  @Field(type => Int)
  readonly screenId: number;

  @Field()
  readonly publicKey: string;

  @Field()
  readonly privateKey: string;
}
