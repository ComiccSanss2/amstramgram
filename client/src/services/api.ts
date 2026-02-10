import type { User } from "../types";

const API = "/api";

async function post(path: string, data: object): Promise<User> {
  const res = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Erreur");
  return json;
}

export const register = (data: { email: string; mdp: string; pseudo: string; bPrivate?: boolean }) =>
  post("/auth/register", data);

export const login = (data: { email: string; mdp: string }) => post("/auth/login", data);
