"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const token = typeof window !== "undefined" ? localStorage.getItem("tf_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("tf_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  const login = (token, user) => {
    localStorage.setItem("tf_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("tf_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;  
