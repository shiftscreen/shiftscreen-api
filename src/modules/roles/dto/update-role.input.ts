import { IsEnum, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PermissionType } from '../enums/permission-type.enum';

@InputType()
export class UpdateRoleInput {
  @Field(type => PermissionType, { nullable: true })
  @IsOptional()
  @IsEnum(PermissionType)
  readonly permissionType?: PermissionType;
}
