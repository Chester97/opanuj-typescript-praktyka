import { hasAccess, User, UserPermission, UserRole } from './task.ts';

const userEditor: User = {
  role: UserRole.EDITOR,
  permissions: [UserPermission.READ, UserPermission.WRITE],
};

const userViewer: User = {
  role: UserRole.VIEWER,
  permissions: [UserPermission.READ],
};

hasAccess(userEditor, UserPermission.READ);
hasAccess(userViewer, UserPermission.DELETE);
