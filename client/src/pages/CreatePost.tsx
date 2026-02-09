import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostService } from '../services/post.services.js';

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const MOCK_USER_ID = "user_test_123"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Le message ne peut pas être vide.");
      return;
    }

    try {
      const newPost = await PostService.create(content, MOCK_USER_ID);
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      setError("Erreur API : Impossible de publier."); 
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
        <button type="submit" disabled={!content.trim()} style={{ marginTop: '10px' }}>
          Publier
        </button>
      </form>
    </div>
  );
};