export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: number;
  name: string;
  path: string;
  icon?: string;
  children?: Menu[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}