import * as api from "./api";
import type { User } from "../types";

const USERS = "/api/users";

export const ProfilService = {
  getById: (id: string) => api.get<User>(`${USERS}/${id}`),
};
