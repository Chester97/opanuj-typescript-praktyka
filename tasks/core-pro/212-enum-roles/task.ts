export enum UserPermission {
  VIEW = 'VIEW',
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export interface User {
  role: UserRole;
  permissions: UserPermission[];
}

export function hasAccess(user: User, requiredPermission: UserPermission): boolean {
  if (user.role === 'ADMIN') return true;
  return user.permissions.includes(requiredPermission);
}
