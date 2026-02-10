import * as api from "./api";
import type { User } from "../types";

const AUTH = "/auth";

export const AuthService = {
  login: (email: string, mdp: string) =>
    api.post<User>(`${AUTH}/login`, { email, mdp }),

  register: (email: string, mdp: string, pseudo: string, bPrivate?: boolean) =>
    api.post<User>(`${AUTH}/register`, { email, mdp, pseudo, bPrivate }),
};
