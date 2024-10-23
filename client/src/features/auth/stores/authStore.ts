import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStatus = "idle" | "initializing" | "authenticated" | "unauthenticated";

type User = { id: number; username: string; role: string; createdAt: Date };

interface AuthState {
  status: AuthStatus;
  user: User | null;
}

interface AuthActions {
  setAuthState: ({ status, user }: AuthState) => void;
  logout: () => void;
}

export const useAuthState = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      status: "idle",
      user: null,
      setAuthState: ({ status, user }) => set({ status, user }),
      logout: () => {
        localStorage.removeItem("token");
        set({ status: "unauthenticated", user: null });
      },
    }),
    {
      name: "authState",
    }
  )
);
