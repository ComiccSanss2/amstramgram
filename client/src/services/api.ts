import type { User, Post } from "../types";

const API = "http://localhost:3000";

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

export const getMyProfile = async (userId: string): Promise<{ user: User; posts: Post[] }> => {

  const response = await fetch(`${API}/posts?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Could not fetch profile data");
  }
  const posts = await response.json();
  
  return {
    posts: posts.filter((p: Post) => p.id_user === userId),
    
  } as any; 
};