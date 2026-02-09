import type { Request, Response } from 'express';

interface Post {
  id: string;
  id_user: string;
  like: number;
  content: string;
  date_creation: string;
}

const posts: Post[] = [];

export const PostController = {
  create: (req: Request, res: Response) => {
    const { content, id_user } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Le contenu ne peut pas être vide" });
    }
    const newPost: Post = {
      id: Date.now().toString(),
      id_user: id_user || "anon",
      like: 0,
      content: content,
      date_creation: new Date().toISOString()
    };
    posts.unshift(newPost);
    return res.status(201).json(newPost);
  },

  getOne: (req: Request, res: Response) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    return res.status(200).json({ post, comments: [] });
  },

  getAll: (req: Request, res: Response) => {
    return res.status(200).json(posts);
  }
};