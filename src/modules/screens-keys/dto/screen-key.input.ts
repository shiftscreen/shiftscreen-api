import { Field, InputType, ObjectType, Int } from 'type-graphql';

@InputType('ScreenKeyInput')
@ObjectType('ScreenKeyInputSubscription')
export class ScreenKeyInput {
  @Field(type => Int)
  readonly screenId: number;

  @Field()
  readonly publicKey: string;

  @Field()
  readonly privateKey: string;
}
