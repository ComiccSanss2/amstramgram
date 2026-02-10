import type { Request, Response } from 'express';

interface Post {
  id: string;
  id_user: string;
  pseudo: string;
  like: number;
  content: string;
  date_creation: string;
}

const posts: Post[] = [];

function bad(res: Response, msg: string, status = 400) {
  res.status(status).json({ error: msg });
}

export const PostController = {
  create: (req: Request, res: Response) => {
    const { content, id_user, pseudo } = req.body;
    if (!content?.trim() || !id_user || !pseudo) {
      return bad(res, "Contenu, utilisateur et pseudo requis");
    }
    const newPost: Post = {
      id: Date.now().toString(),
      id_user,
      pseudo: pseudo.trim(),
      like: 0,
      content: content.trim(),
      date_creation: new Date().toISOString(),
    };
    posts.unshift(newPost);
    res.status(201).json(newPost);
  },

  getOne: (req: Request, res: Response) => {
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return bad(res, "Post non trouvé", 404);
    res.json({ post, comments: [] });
  },

  getAll: (_req: Request, res: Response) => {
    res.json(posts);
  },
};
