import { hasAccess, User } from './task.ts';

const userEditor: User = {
  role: 'edtor',
  permissions: ['READ', 'wrajt'],
};

const userViewer: User = {
  role: 'reader',
  permissions: ['rid'],
};
