import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateOrganizationInput {
  @Field()
  @IsString()
  readonly title: string;
}
