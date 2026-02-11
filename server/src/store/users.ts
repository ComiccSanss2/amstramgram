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

export function followUser(followerId: string, targetId: string): boolean {
  const follower = byId.get(followerId);
  const target = byId.get(targetId);

  if (!follower || !target || followerId === targetId) return false;

  if (!follower.following.includes(targetId)){
    follower.following.push(targetId);
  }
  if(!target.followers.includes(followerId)){
    target.followers.push(followerId)
  }
return true;
}

export function unfollowUser(followerId: string, targetId: string): boolean {
  const follower = byId.get(followerId);
  const target = byId.get(targetId);

  if (!follower || !target) return false;

  follower.following = follower.following.filter((id) => id != targetId);
  target.followers = target.followers.filter((id) => id != targetId);

  return true;
}
