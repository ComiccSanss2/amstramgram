import type { User, Post } from "../types";

const API = "http://localhost:3000";

async function request<T>(
  path: string,
  options?: { method?: "GET" | "POST"; body?: object }
): Promise<T> {
  const init: RequestInit = {
    method: options?.method ?? "GET",
    headers: { "Content-Type": "application/json" },
  };
  if (options?.body) {
    init.body = JSON.stringify(options.body);
  }
  const res = await fetch(API + path, init);
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error("Réponse serveur invalide.");
  }
  if (!res.ok) throw new Error((json as { error?: string })?.error ?? "Erreur");
  return json as T;
}

export const get = <T>(path: string) => request<T>(path, { method: "GET" });
export const post = <T>(path: string, data: object) => request<T>(path, { method: "POST", body: data });
