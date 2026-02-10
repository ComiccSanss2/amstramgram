import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PostService } from '../services/post.services.js';

export const CreatePost = () => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Le message ne peut pas être vide.");
      return;
    }

    if (!user) return;

    try {
      const newPost = await PostService.create(content, user.id, user.pseudo);
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la publication.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Créer un Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Exprimez-vous..."
          style={{ width: '100%', height: '100px', padding: '10px' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn-submit" disabled={!content.trim()}>
          Publier
        </button>
      </form>
    </div>
  );
};