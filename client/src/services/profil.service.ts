import * as api from "./api";
import type { User } from "../types";

const USERS = "/api/users";

export interface UpdateUserData {
  email?: string;
  mdp?: string;
  pseudo?: string;
  bPrivate?: boolean;
}

export interface SearchResponse {
  data: User[];
}

export const ProfilService = {
  getById: (id: string) => api.get<User>(`${USERS}/${id}`),
  update: (data: UpdateUserData) => api.put<User>(`${USERS}/me`, data),
  search: (q: string) => api.get<SearchResponse>(`${USERS}/search?q=${encodeURIComponent(q)}`),
};
