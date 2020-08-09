import { Field, Int, ObjectType } from 'type-graphql';
import { TokenType } from '../enums/token-type.enum';

@ObjectType()
export class TokenResponse {
  @Field(type => String)
  tokenType: TokenType;

  @Field()
  accessToken: string;

  @Field(type => Int)
  expiresIn: number;
}
