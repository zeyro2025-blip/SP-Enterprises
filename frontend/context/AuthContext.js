"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("sp_token");
    const storedUser = window.localStorage.getItem("sp_user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setReady(true);
  }, []);

  const syncAuth = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    window.localStorage.setItem("sp_token", payload.token);
    window.localStorage.setItem("sp_user", JSON.stringify(payload.user));
  };

  const login = async (credentials) => {
    const data = await api.post("/auth/login", credentials);
    syncAuth(data);
  };

  const signup = async (payload) => {
    const data = await api.post("/auth/signup", payload);
    syncAuth(data);
  };

  const refreshUser = async () => {
    if (!token) return;
    const data = await api.get("/auth/me", token);
    setUser(data.user);
    window.localStorage.setItem("sp_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    window.localStorage.removeItem("sp_token");
    window.localStorage.removeItem("sp_user");
  };

  return (
    <AuthContext.Provider value={{ token, user, ready, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
