import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../types";
import { AuthService } from "../services/auth.service";

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

function loadUser(): User | null {
  try {
    const r = localStorage.getItem(KEY);
    return r ? (JSON.parse(r) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [error, setError] = useState<string | null>(null);

  async function doAuth(fn: () => Promise<User>) {
    setError(null);
    const u = await fn();
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
    window.history.replaceState(null, "", "/");
  }

  const login = (email: string, mdp: string) =>
    doAuth(() => AuthService.login(email, mdp)).catch((e) => {
      setError(e instanceof Error ? e.message : "Erreur");
      throw e;
    });

  const register = (email: string, mdp: string, pseudo: string, bPrivate?: boolean) =>
    doAuth(() => AuthService.register(email, mdp, pseudo, bPrivate)).catch((e) => {
      setError(e instanceof Error ? e.message : "Erreur");
      throw e;
    });

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  return (
    <AuthContext.Provider value={{ user, error, login, register, logout, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth inside AuthProvider");
  return ctx;
}
