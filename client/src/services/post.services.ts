import * as api from "./api";
import type { Post, Comment } from "../types";

const POSTS = "/api/posts";

export interface PostDetailResponse {
  post: Post;
  comments: Comment[];
}

export const PostService = {
  create: (content: string, id_user: string, pseudo: string) =>
    api.post<Post>(POSTS, { content, id_user, pseudo }),

  getById: (id: string) =>
    api.get<PostDetailResponse>(`${POSTS}/${id}`),

  getAll: () => api.get<Post[]>(POSTS),
};
