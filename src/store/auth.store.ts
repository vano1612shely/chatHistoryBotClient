import { create } from "zustand";

export type AuthState = {
  is_auth: boolean;
  token: string;
};

export type AuthAction = {
  login: (token: string) => void;
  clear: () => void;
};
const initialState: AuthState = {
  is_auth: false,
  token: "",
};
export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  ...initialState,
  login: (token: string) => {
    try {
      set({
        is_auth: true,
        token: token,
      });
      localStorage.setItem("token", token);
    } catch (e) {
      console.log(e);
    }
  },
  clear: () => {
    set({
      is_auth: false,
      token: "",
    });
    localStorage.removeItem("token");
  },
}));
