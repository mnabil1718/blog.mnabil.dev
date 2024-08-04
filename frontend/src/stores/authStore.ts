import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  activated: boolean;
  created_at: string; // time
}

export const emptyUser: User = {
  id: 0,
  name: "",
  email: "",
  activated: false,
  created_at: "",
};

interface AuthState {
  auth_token: string;
  user: User;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth_token: "",
      user: emptyUser,
      setToken: (token) => set({ auth_token: token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
