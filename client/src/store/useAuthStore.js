import axios from "axios";
import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  user: null,
  setUser: (update) => {
    set((state) => ({
      user: typeof update === "function" ? update(state.user) : update,
    }));
  },

  socket: null,
  onlineUsers: [],

  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axios.get("/api/auth/check");
      set({ user: res.data });
      get().connectSocket();
    } catch (error) {
      set({ user: null });
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
      get().connectSocket();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  },

  logout: async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      set({ user: null });
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: user._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null });
  },
}));
