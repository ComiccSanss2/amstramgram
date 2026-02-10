import * as api from "./api"; 
import type { Post, Comment } from "../types";

const POSTS = "/api/posts";

export interface PostDetailResponse {
  post: Post;
  comments: Comment[];
}

export interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    hasMore: boolean;
  };
}

export const PostService = {
  create: (content: string, id_user: string, pseudo: string, image?: string) =>
    api.post<Post>(POSTS, { content, id_user, pseudo, image }),

  getById: (id: string) =>
    api.get<PostDetailResponse>(`${POSTS}/${id}`),


  getAll: (page: number = 1) => 
    api.get<PostsResponse>(`${POSTS}?page=${page}&limit=2`),
};