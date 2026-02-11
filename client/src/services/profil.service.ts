import * as api from "./api";
import type { User } from "../types";
import { Target } from "lucide-react";

const USERS = "/api/users";

export const ProfilService = {
  getById: (id: string) => api.get<User>(`${USERS}/${id}`),

  follow: (targetId: string, myId: string) => api.post(`${USERS}/${targetId}/follow`,{id_user: myId}), 

  unfollow: (targetId: string, myId: string) => api.post(`${USERS}/${targetId}/unfollow`, {id_user: myId})
};
