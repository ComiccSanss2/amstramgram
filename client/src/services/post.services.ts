import type { Post, Comment } from '../types/index';

const API_URL = 'http://localhost:3000/api/posts';

interface PostDetailResponse {
  post: Post;
  comments: Comment[];
}

export const PostService = {
  create: async (content: string, id_user: string): Promise<Post> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, id_user }),
    });
    if (!response.ok) throw new Error("Erreur création");
    return response.json();
  },

  getById: async (id: string): Promise<PostDetailResponse> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Non trouvé");
    return response.json();
  },

  getAll: async (): Promise<Post[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur feed");
    return response.json();
  }
};