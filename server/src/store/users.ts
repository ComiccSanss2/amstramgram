import type { User } from "../entities/index.js";

const byId = new Map<string, User>();
const byEmail = new Map<string, User>();

export function addUser(user: User) {
  byId.set(user.id, user);
  byEmail.set(user.email.toLowerCase(), user);
  const { mdp: _, ...pub } = user;
  return pub;
}

export function findByEmail(email: string): User | undefined {
  return byEmail.get(email.toLowerCase());
}

export function findById(id: string): User | undefined {
  return byId.get(id);
}
