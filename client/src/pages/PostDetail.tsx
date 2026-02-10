import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostService } from '../services/post.services'; 
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Barre de navigation */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#0095f6', fontWeight: 'bold' }}> 
          &larr; Retour au Feed
        </Link>
      </div>

      <div className="card">
        {/* En-tête avec le pseudo */}
        <h2 style={{ fontSize: '1.2rem', margin: '0 0 15px 0' }}>
          @{data.post.pseudo || "Anonyme"}
        </h2>

        {/* --- IMAGE --- */}
        {data.post.image && (
          <img 
            src={data.post.image} 
            alt="Contenu du post" 
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              objectFit: 'cover' 
            }} 
          />
        )}

        {/* Contenu Texte */}
        <p style={{ fontSize: '1.1em', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
          {data.post.content}
        </p>

        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
        
        <small style={{ color: '#888' }}>
          Publié le {new Date(data.post.date_creation).toLocaleDateString()} • {data.post.like} J'aime
        </small>
      </div>
    </div>
  );
};