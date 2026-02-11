import fs from "node:fs";
import path from "node:path";
import type { Post, Comment } from "../entities/index.js";

const dataDir = path.join(process.cwd(), "data");
const postsPath = path.join(dataDir, "posts.json");
const commentsPath = path.join(dataDir, "comments.json");

export const posts: Post[] = [];
export const comments: Comment[] = [];

function load() {
  try {
    const p = fs.readFileSync(postsPath, "utf-8");
    posts.length = 0;
    posts.push(...JSON.parse(p));
  } catch {
    posts.length = 0;
  }
  try {
    const c = fs.readFileSync(commentsPath, "utf-8");
    comments.length = 0;
    comments.push(...JSON.parse(c));
  } catch {
    comments.length = 0;
  }
}

export function savePosts() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), "utf-8");
}

export function saveComments() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2), "utf-8");
}

load();
