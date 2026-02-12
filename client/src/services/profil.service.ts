import * as api from "./api";
import type { User } from "../types";
import { Target } from "lucide-react";

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

  follow: (targetId: string, myId: string) => api.post(`${USERS}/${targetId}/follow`,{id_user: myId}), 
  unfollow: (targetId: string, myId: string) => api.post(`${USERS}/${targetId}/unfollow`, {id_user: myId})
};
