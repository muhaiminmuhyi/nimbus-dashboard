export interface User {
  id: string;
  name: string;
  email: string;
  roles: { id: string; name: string }[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  name: string;
  path: string;
  icon?: string;
  children?: Menu[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}