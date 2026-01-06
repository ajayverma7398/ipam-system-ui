import usersData from './users.json';

export type UserRole = 'admin' | 'network_engineer' | 'operator' | 'viewer';

export interface User {
  id: string; 
  username: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  created_at: string; 
  last_login: string; 
  is_active: boolean;
  permissions: string[];
}

export const users: User[] = usersData as User[];

export default users;

