import { IsEnum } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PermissionType } from '../enums/permission-type.enum';

@InputType()
export class UpdateRoleInput {
  @Field(type => PermissionType)
  @IsEnum(PermissionType)
  readonly permissionType: PermissionType;
}
