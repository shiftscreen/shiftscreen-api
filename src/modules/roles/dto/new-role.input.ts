import { IsEnum, IsNumber} from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { PermissionType } from '../enums/permission-type.enum';

@InputType()
export class NewRoleInput {
  @Field(type => PermissionType)
  @IsEnum(PermissionType)
  readonly permissionType: PermissionType;

  @Field(type => Int)
  @IsNumber()
  readonly userId: number;

  @Field(type => Int)
  @IsNumber()
  readonly organizationId: number;
}
