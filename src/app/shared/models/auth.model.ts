export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}