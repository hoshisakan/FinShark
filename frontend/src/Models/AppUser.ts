export interface AppUser {
  id: string;
  userName?: string;
  email?: string;
}

export interface AuthUser {
  username: string;
  email: string;
  token: string;
}
