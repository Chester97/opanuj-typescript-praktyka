export enum UserPermission {}

export enum UserRole {}

export interface User {
  role: string;
  permissions: string[];
}

export function hasAccess(user: User, requiredPermission: string): boolean {
  if (user.role === 'ADMIN') return true;
  return user.permissions.includes(requiredPermission);
}
