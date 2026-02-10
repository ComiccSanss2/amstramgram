import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";
import { AuthService } from "../services/auth.service";

const TOKEN_KEY = "amstramgram_token";

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
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    AuthService.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      });
  }, []);

  async function doAuth(fn: () => Promise<{ token: string }>) {
    setError(null);
    const { token } = await fn();
    localStorage.setItem(TOKEN_KEY, token);
    const u = await AuthService.me();
    setUser(u);
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
    localStorage.removeItem(TOKEN_KEY);
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
