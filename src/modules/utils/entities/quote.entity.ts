import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Quote {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  author: string;
}
