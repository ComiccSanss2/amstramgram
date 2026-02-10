import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
import * as api from "../services/api";

const KEY = "amstramgram_user";

type Auth = {
  user: User | null;
  error: string | null;
  login: (email: string, mdp: string) => Promise<void>;
  register: (email: string, mdp: string, pseudo: string, bPrivate?: boolean) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const r = localStorage.getItem(KEY);
      return r ? (JSON.parse(r) as User) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, mdp: string) {
    setError(null);
    try {
      const u = await api.login({ email, mdp });
      setUser(u);
      localStorage.setItem(KEY, JSON.stringify(u));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      throw e;
    }
  }

  async function register(email: string, mdp: string, pseudo: string, bPrivate?: boolean) {
    setError(null);
    try {
      const u = await api.register({ email, mdp, pseudo, bPrivate });
      setUser(u);
      localStorage.setItem(KEY, JSON.stringify(u));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      throw e;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(KEY);
  }

  return (
    <AuthContext.Provider
      value={{ user, error, login, register, logout, clearError: () => setError(null) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth inside AuthProvider");
  return ctx;
}
