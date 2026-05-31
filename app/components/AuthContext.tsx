"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });
      
      if (response.ok) {
        setUser(null);
        window.location.href = "/";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.location.href = "/api/auth/google/signin";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
