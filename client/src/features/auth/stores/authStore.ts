import { create } from "zustand";

type AuthStatus = "idle" | "initializing" | "authenticated" | "unauthenticated";

type Role = "admin" | "user";

// todo: align with db
export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: Role;
  avatarImage?: { data: number[]; type: "Buffer" };
  backgroundImage?: { data: number[]; type: "Buffer" };
  createdAt: Date;
  isActive: boolean;
  ownedClassroomCount: number;
};

interface AuthState {
  status: AuthStatus;
}

interface AuthActions {
  setAuthStatus: (status: AuthStatus) => void;
  logout: () => void;
}

export const useAuthState = create<AuthState & AuthActions>((set) => ({
  status: "idle",
  user: null,
  setAuthStatus: (status) => {
    set({ status });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ status: "unauthenticated" });
  },
}));
