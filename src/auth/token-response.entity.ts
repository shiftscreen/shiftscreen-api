import { Field, ObjectType } from 'type-graphql';
import { TokenType } from './enums/token-type.enum';

@ObjectType()
export class TokenResponse {
  @Field()
  accessToken: string;

  @Field(type => String)
  tokenType: TokenType;

  @Field(type => String)
  expiresIn: string;
}
