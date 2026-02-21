import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { login as loginApi, register as registerApi } from "../Services/AuthService";
import type { AuthUser } from "../Models/AppUser";

type LoginPayload = {
  username: string;
  password: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_KEY = "auth_token";

const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const authUser = await loginApi(payload);
      setUser(authUser);
      setToken(authUser.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(AUTH_TOKEN_KEY, authUser.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const authUser = await registerApi(payload);
      setUser(authUser);
      setToken(authUser.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(AUTH_TOKEN_KEY, authUser.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
