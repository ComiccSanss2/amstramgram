import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostService } from '../services/post.services'; 
import type { Post, Comment } from '../types/index';
import { HeartIcon, MessageCircleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState<{ post: Post; comments: Comment[] } | null>(null);
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    if (id) {
      PostService.getById(id).then(setData).catch(console.error);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!user || !id || !commentText.trim()) return;
    setSubmitting(true);
    try {
      await PostService.createComment(id, commentText.trim(), user.id, user.pseudo);
      setCommentText("");
      setCommentModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    const comment = data?.comments.find(c => c.id === commentId);
    if (!comment) return;

    const isLiked = comment.liked_by?.includes(user.id);
    try {
      if (isLiked) {
        const response = await PostService.unlikeComment(commentId, user.id);
        setData(prev => prev ? { ...prev, comments: prev.comments.map(c => c.id === commentId ? response.comment : c) } : null);
      } else {
        const response = await PostService.likeComment(commentId, user.id);
        setData(prev => prev ? { ...prev, comments: prev.comments.map(c => c.id === commentId ? response.comment : c) } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          Publié le {new Date(data.post.date_creation).toLocaleDateString()} • {data.post.liked_by?.length || 0} J'aime
        </small>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => setCommentModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#0095f6', fontWeight: 'bold' }}
        >
          <MessageCircleIcon size={18} />
          Commenter
        </button>
      </div>

      {/* Liste des commentaires */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Commentaires ({data.comments.length})</h3>
        {data.comments.length === 0 ? (
          <p style={{ color: '#8e8e8e', margin: 0 }}>Aucun commentaire.</p>
        ) : (
          data.comments.map((comment) => (
            <div key={comment.id} style={{ padding: '12px 0', borderBottom: '1px solid #efefef' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <strong style={{ fontSize: '0.9em' }}>@{comment.pseudo}</strong>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.95em' }}>{comment.content}</p>
                  <small style={{ color: '#8e8e8e' }}>{new Date(comment.date_creation).toLocaleDateString()}</small>
                </div>
                <button onClick={() => handleLikeComment(comment.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                  <HeartIcon 
                    fill={comment.liked_by?.includes(user?.id || '') ? 'red' : 'none'} 
                    stroke={comment.liked_by?.includes(user?.id || '') ? 'red' : 'black'}
                    size={18} 
                  />
                </button>
              </div>
              <div style={{ fontSize: '0.85em', color: '#8e8e8e', marginTop: '4px' }}>
                {comment.liked_by?.length || 0} J'aime
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal commentaire */}
      {commentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setCommentModal(false)}
        >
          <div
            className="card"
            style={{ width: '90%', maxWidth: '400px', padding: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0' }}>Commenter</h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1em',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={() => setCommentModal(false)} className="btn-submit" style={{ flex: 1 }}>
                Annuler
              </button>
              <button onClick={handleSubmitComment} className="btn-submit" style={{ flex: 1 }} disabled={submitting || !commentText.trim()}>
                {submitting ? 'Envoi...' : 'Poster'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};