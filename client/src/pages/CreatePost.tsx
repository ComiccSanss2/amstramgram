import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { PostService } from '../services/post.services'; 

export const CreatePost = () => {
  const { user } = useAuth(); 
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      setError("Le message ou l'image ne peut pas être vide.");
      return;
    }

    if (!user) {
      setError("Vous devez être connecté.");
      return;
    }

    try {
      const newPost = await PostService.create(content, user.id, user.pseudo, image);
      
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
          placeholder={`Quoi de neuf, ${user?.pseudo} ?`}
          style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
        />

        {/* --- ZONE PREVIEW IMAGE --- */}
        {image && (
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <img 
              src={image} 
              alt="Preview" 
              style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }} 
            />
            <button 
              type="button"
              onClick={() => setImage("")}
              style={{ 
                position: 'absolute', top: '10px', right: '10px', 
                background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', 
                borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' 
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* --- BOUTON UPLOAD --- */}
        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="file-upload" 
            style={{ 
              cursor: 'pointer', color: '#0095f6', fontWeight: 'bold', 
              display: 'flex', alignItems: 'center', gap: '8px' 
            }}
          >
             Ajouter une photo
          </label>
          <input 
            id="file-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button 
          type="submit" 
          className="btn-submit" 
          disabled={!content.trim() && !image} 
          style={{ width: '100%' }}
        >
          Publier
        </button>
      </form>
    </div>
  );
};