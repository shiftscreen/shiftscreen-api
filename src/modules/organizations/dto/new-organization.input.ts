import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class NewOrganizationInput {
  @Field()
  @IsString()
  readonly title: string;
}
