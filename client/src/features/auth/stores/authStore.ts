import { create } from "zustand";

type AuthStatus = "idle" | "initializing" | "authenticated" | "unauthenticated";

type Role = "admin" | "user";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: Role;
  avatarImage?: { data: number[]; type: "Buffer" };
  createdAt: Date;
  isActive: boolean;
};

interface AuthState {
  status: AuthStatus;
}

interface AuthActions {
  // todo: remove to set auth status
  setAuthState: (status: AuthStatus) => void;
  logout: () => void;
}

export const useAuthState = create<AuthState & AuthActions>((set) => ({
  status: "idle",
  user: null,
  setAuthState: (status) => {
    set({ status });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ status: "unauthenticated" });
  },
}));
