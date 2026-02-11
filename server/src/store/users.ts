import fs from "node:fs";
import path from "node:path";
import type { User } from "../entities/index.js";

const dataDir = path.join(process.cwd(), "data");
const usersPath = path.join(dataDir, "users.json");

const byId = new Map<string, User>();
const byEmail = new Map<string, User>();

function load() {
  try {
    const raw = fs.readFileSync(usersPath, "utf-8");
    const list: User[] = JSON.parse(raw);
    byId.clear();
    byEmail.clear();
    for (const u of list) {
      byId.set(u.id, u);
      byEmail.set(u.email.toLowerCase(), u);
    }
  } catch {
    byId.clear();
    byEmail.clear();
  }
}

function save() {
  const list = Array.from(byId.values());
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(usersPath, JSON.stringify(list, null, 2), "utf-8");
}

load();

export function addUser(user: User) {
  byId.set(user.id, user);
  byEmail.set(user.email.toLowerCase(), user);
  save();
  const { mdp: _, ...pub } = user;
  return pub;
}

export function findByEmail(email: string): User | undefined {
  return byEmail.get(email.toLowerCase());
}

export function findById(id: string): User | undefined {
  return byId.get(id);
}

export function searchByPseudo(query: string): Omit<User, "mdp">[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const list = Array.from(byId.values());
  return list
    .filter((u) => u.pseudo.toLowerCase().includes(q))
    .map(({ mdp: _, ...pub }) => pub);
}

export function updateUser(
  id: string,
  updates: { email?: string; mdp?: string; pseudo?: string; bPrivate?: boolean }
): User | undefined {
  const user = byId.get(id);
  if (!user) return undefined;

  if (updates.email !== undefined) {
    const existing = findByEmail(updates.email);
    if (existing && existing.id !== id) return undefined;
    byEmail.delete(user.email.toLowerCase());
    user.email = updates.email;
    byEmail.set(user.email.toLowerCase(), user);
  }
  if (updates.mdp !== undefined) user.mdp = updates.mdp;
  if (updates.pseudo !== undefined) user.pseudo = updates.pseudo;
  if (updates.bPrivate !== undefined) user.bPrivate = updates.bPrivate;

  save();
  return user;
}
