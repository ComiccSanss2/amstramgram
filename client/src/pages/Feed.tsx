import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostService } from '../services/post.services.js';
import type { Post } from '../types/index';

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    PostService.getAll().then(setPosts).catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Amstramgram</h1>

      {posts.length === 0 ? (
        <div className="card">Aucun post pour le moment.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card">
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{post.pseudo}</div>
            <p>{post.content}</p>
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
              <span>{new Date(post.date_creation).toLocaleDateString()}</span>
              <Link to={`/post/${post.id}`}>Voir détails &rarr;</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};