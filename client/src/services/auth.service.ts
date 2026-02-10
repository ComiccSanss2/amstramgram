import * as api from "./api";
import type { User } from "../types";

const AUTH = "/auth";

export type AuthResponse = { token: string };

export const AuthService = {
  login: (email: string, mdp: string) =>
    api.post<AuthResponse>(`${AUTH}/login`, { email, mdp }),

  register: (email: string, mdp: string, pseudo: string, bPrivate?: boolean) =>
    api.post<AuthResponse>(`${AUTH}/register`, { email, mdp, pseudo, bPrivate }),

  me: () => api.get<User>("/api/users/me"),
};
