import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostService } from '../services/post.services.js';
import type { Post, Comment } from '../types/index';

export const PostDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<{ post: Post; comments: Comment[] } | null>(null);

  useEffect(() => {
    if (id) {
      PostService.getById(id).then(setData).catch(console.error);
    }
  }, [id]);

  if (!data) return <p>Chargement...</p>;

  return (
    <div>
      {/* Barre de navigation simple */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/"> &larr; Retour au Feed</Link>
      </div>

      <div className="card">
        <h2>Post</h2>
        <p style={{ fontSize: '1.2em', whiteSpace: 'pre-wrap' }}>{data.post.content}</p>
        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
        <small>ID: {data.post.id} • Likes: {data.post.like}</small>
      </div>
    </div>
  );
};