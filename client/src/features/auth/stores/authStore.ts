import { create } from "zustand";
import { queryClient } from "@/services/ReactQuery";

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
  backgroundImage?: { data: number[]; type: "Buffer" };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  ownedClassroomCount: number;
};

export type SimpleUser = Pick<
  User,
  "id" | "username" | "firstName" | "lastName" | "avatarImage"
>;

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
    queryClient.clear();
  },
}));
