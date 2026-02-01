export interface CreateUserForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isActive: boolean;
}

export interface CreateUserRequest extends Omit<CreateUserForm, 'confirmPassword'> {}

export interface StoreUserData {
  name: string;
  email: string;
  password: string;
  role_id: string;
  status: string;
}

export interface CreateUserResponse {
  id: number;
  message: string;
}