import { Field, ObjectType } from 'type-graphql';;

@ObjectType()
export class FileLink {
  @Field()
  readonly url: string;

  @Field()
  readonly expiryTime: number;
}
