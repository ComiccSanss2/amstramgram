import type { Request, Response } from 'express';
import type { Post, Comment } from '../entities/index.ts';

const posts: Post[] = [];
const comments: Comment[] = [];

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
      liked_by: [],
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
    
    const postComments = comments.filter(c => c.id_post === post.id);
    return res.json({ post, comments: postComments });
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

  likePost: (req: Request, res: Response) => {
    const { id_user } = req.body;
    const post = posts.find(p => p.id === req.params.id);

    if (!post) return bad(res, "Post non trouvé", 404);
    if (post.liked_by.includes(id_user)) {
      return bad(res, "Post déjà liké", 400);
    }
    post.liked_by.push(id_user);
    return res.status(200).json({ post });
  },

  unlikePost: (req: Request, res: Response) => {
    const { id_user } = req.body;
    const post = posts.find(p => p.id === req.params.id);

    if (!post) return bad(res, "Post non trouvé", 404);
    if (!post.liked_by.includes(id_user)) {
      return bad(res, "Post non liké", 400);
    }
    post.liked_by = post.liked_by.filter(id => id !== id_user);
    return res.status(200).json({ post });
  },

  createComment: (req: Request, res: Response) => {
    const { content, id_user, pseudo } = req.body;
    const { id: id_post } = req.params;

    if (!content?.trim() || !id_user || !pseudo || !id_post) {
      return bad(res, "Contenu, utilisateur et pseudo requis.");
    }

    const post = posts.find(p => p.id === id_post);
    if (!post) return bad(res, "Post non trouvé", 404);

    const newComment: Comment = {
      id: Date.now().toString(),
      id_post,
      id_user,
      pseudo: pseudo.trim(),
      liked_by: [],
      content: content.trim(),
      date_creation: new Date().toISOString(),
    };

    comments.push(newComment);
    return res.status(201).json(newComment);
  },

  likeComment: (req: Request, res: Response) => {
    const { id_user } = req.body;
    const comment = comments.find(c => c.id === req.params.id);

    if (!comment) return bad(res, "Commentaire non trouvé", 404);
    if (comment.liked_by.includes(id_user)) {
      return bad(res, "Commentaire déjà liké", 400);
    }
    comment.liked_by.push(id_user);
    return res.status(200).json({ comment });
  },

  unlikeComment: (req: Request, res: Response) => {
    const { id_user } = req.body;
    const comment = comments.find(c => c.id === req.params.id);

    if (!comment) return bad(res, "Commentaire non trouvé", 404);
    if (!comment.liked_by.includes(id_user)) {
      return bad(res, "Commentaire non liké", 400);
    }
    comment.liked_by = comment.liked_by.filter(id => id !== id_user);
    return res.status(200).json({ comment });
  }
};