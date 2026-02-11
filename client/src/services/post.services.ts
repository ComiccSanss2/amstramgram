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

  likePost: (id: string, id_user: string) =>
    api.post<{ post: Post }>(`${POSTS}/like/${id}`, { id_user }),

  unlikePost: (id: string, id_user: string) =>
    api.post<{ post: Post }>(`${POSTS}/unlike/${id}`, { id_user }),

  createComment: (postId: string, content: string, id_user: string, pseudo: string) =>
    api.post<Comment>(`${POSTS}/comment/${postId}`, { content, id_user, pseudo }),

  likeComment: (commentId: string, id_user: string) =>
    api.post<{ comment: Comment }>(`${POSTS}/comment/like/${commentId}`, { id_user }),

  unlikeComment: (commentId: string, id_user: string) =>
    api.post<{ comment: Comment }>(`${POSTS}/comment/unlike/${commentId}`, { id_user }),

  delete: (id: string) => 
    api.del<void>(`${POSTS}/${id}`),
  deleteComment: (commentId: string) => 
    api.del<void>(`${POSTS}/comment/${commentId}`),
};