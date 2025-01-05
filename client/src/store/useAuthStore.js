import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (update) => {
    set((state) => ({
      user: typeof update === "function" ? update(state.user) : update,
    }));
    
  },

  isCheckingAuth: true,
  checkAuth: async (enqueueSnackbar) => {
    try {
      const res = await axios.get("/api/auth/check");
      set({ user: res.data });
    } catch (error) {
      set({ user: null });
      enqueueSnackbar("Error in authenticating. Please login in again", {
        variant: "error",
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (username, password, setLoading) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/auth/login",
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      set({ user: res.data.user });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  },
}));
