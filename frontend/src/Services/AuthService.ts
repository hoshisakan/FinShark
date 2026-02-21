import apiService from "./ApiService";
import type { AuthUser } from "../Models/AppUser";

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const response = await apiService.post<AuthUser>("account/login", payload);
  return response.data;
};

export const register = async (payload: RegisterRequest): Promise<AuthUser> => {
  const response = await apiService.post<AuthUser>("account/register", payload);
  return response.data;
};
