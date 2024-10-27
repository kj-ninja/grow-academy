import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStatus = "idle" | "initializing" | "authenticated" | "unauthenticated";

type Role = "admin" | "user";

export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: Role;
  avatarImage?: null | { data: number[]; type: "Buffer" };
  createdAt: Date;
  isActive: boolean;
};

interface AuthState {
  status: AuthStatus;
  user: User | null;
}

interface AuthActions {
  setAuthState: ({ status, user }: AuthState) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthState = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      status: "idle",
      user: null,
      setAuthState: ({ status, user }) => {
        const token = localStorage.getItem("token");
        if (status === "authenticated" && !token) {
          set({ status: "unauthenticated", user: null });
        } else {
          set({ status, user });
        }
      },
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        set({ status: "unauthenticated", user: null });
      },
    }),
    {
      name: "authState",
    },
  ),
);
