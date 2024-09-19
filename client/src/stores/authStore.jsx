import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  isAdmin: Cookies.get("isAdmin") === "true",
  setCurrentUser: (user) => {
    if (user) {
      const { isAdmin, ...userWithoutAdmin } = user;
      set({ currentUser: userWithoutAdmin, isAdmin: isAdmin === 1 });
      localStorage.setItem("user", JSON.stringify(userWithoutAdmin));
      Cookies.set("isAdmin", isAdmin === 1 ? "true" : "false");
    } else {
      set({ currentUser: null, isAdmin: false });
      localStorage.removeItem("user");
      Cookies.remove("isAdmin");
    }
  },
  login: async (inputs) => {
    try {
      localStorage.clear();
      const res = await axios.post(
        "http://localhost:9900/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );
      const { isAdmin, ...userWithoutAdmin } = res.data;
      set({ currentUser: userWithoutAdmin, isAdmin: isAdmin === 1 });
      localStorage.setItem("user", JSON.stringify(userWithoutAdmin));
      Cookies.set("isAdmin", isAdmin === 1 ? "true" : "false");
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  },
  logout: async () => {
    try {
      localStorage.clear();
      await axios.get("http://localhost:9900/api/auth/logout", {
        withCredentials: true,
      });
      set({ currentUser: null, isAdmin: false });
      Cookies.remove("isAdmin");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  },
}));

export default useAuthStore;
