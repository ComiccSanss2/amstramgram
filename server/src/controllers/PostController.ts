import type { Request, Response } from 'express';

interface Post {
  id: string;
  id_user: string;
  pseudo: string;
  like: number;
  content: string;
  image?: string; 
  date_creation: string;
}

const posts: Post[] = [];

function bad(res: Response, msg: string, status = 400) {
  return res.status(status).json({ error: msg });
}

export const PostController = {
  create: (req: Request, res: Response) => {
    const { content, id_user, pseudo, image } = req.body;
    
    if ((!content?.trim() && !image) || !id_user || !pseudo) {
      return bad(res, "Contenu ou image requis, ainsi que l'utilisateur.");
    }

    const newPost: Post = {
      id: Date.now().toString(),
      id_user,
      pseudo: pseudo.trim(),
      like: 0,
      content: content ? content.trim() : "",
      image: image,
      date_creation: new Date().toISOString(),
    };

    posts.unshift(newPost);
    return res.status(201).json(newPost);
  },

  getOne: (req: Request, res: Response) => {
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return bad(res, "Post non trouvé", 404);
    return res.json({ post, comments: [] });
  },


  getAll: (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const sortedPosts = [...posts].sort((a, b) => {
      return new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime();
    });

    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return res.json({
      data: paginatedPosts,
      meta: {
        total: posts.length,
        page: page,
        hasMore: endIndex < posts.length
      }
    });

  },
};