import { SetMetadata } from '@nestjs/common';

export const Roles = (roles: RoleTypes[]) => SetMetadata('roles', roles);

export enum RoleTypes {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User',
  Vendor = 'Vendor',
}
