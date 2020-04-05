import { registerEnumType } from 'type-graphql';

export enum PermissionType {
  Admin = "ADMIN",
  Editor = "EDITOR",
}

registerEnumType(PermissionType, {
  name: 'PermissionType'
});
