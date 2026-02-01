export interface CreateUserForm {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  isActive: boolean;
}

export interface CreateUserRequest extends Omit<CreateUserForm, 'confirmPassword'> {}

export interface CreateUserResponse {
  id: number;
  message: string;
}