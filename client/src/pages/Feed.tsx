import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostService } from '../services/post.services';
import type { Post } from '../types/index';
import { HeartIcon, MessageCircleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentModal, setCommentModal] = useState<{ open: boolean; postId: string | null }>({ open: false, postId: null });
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  
  const loadPosts = async (pageNumber: number) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await PostService.getAll(pageNumber);
      
      if (pageNumber === 1) {
        setPosts(response.data);
      } else {
        setPosts((prevPosts) => {
          const newUniquePosts = response.data.filter(
            (newPost) => !prevPosts.some((existing) => existing.id === newPost.id)
          );
          return [...prevPosts, ...newUniquePosts];
        });
      }
      
      setHasMore(response.meta.hasMore);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage); 
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const isLiked = post.liked_by?.includes(user.id);
    
    try {
      if (isLiked) {
        const response = await PostService.unlikePost(postId, user.id);
        // Mettre à jour l'état local avec la réponse du serveur
        setPosts(prevPosts => 
          prevPosts.map(p => p.id === postId ? response.post : p)
        );
      } else {
        const response = await PostService.likePost(postId, user.id);
        // Mettre à jour l'état local avec la réponse du serveur
        setPosts(prevPosts => 
          prevPosts.map(p => p.id === postId ? response.post : p)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalLikes = (post: Post) => {
    return post.liked_by?.length || 0;
  };

  const openCommentModal = (postId: string) => {
    setCommentModal({ open: true, postId });
    setCommentText("");
  };

  const closeCommentModal = () => {
    setCommentModal({ open: false, postId: null });
    setCommentText("");
  };

  const handleSubmitComment = async () => {
    if (!user || !commentModal.postId || !commentText.trim()) return;
    setSubmitting(true);
    try {
      await PostService.createComment(commentModal.postId, commentText.trim(), user.id, user.pseudo);
      closeCommentModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Amstramgram</h1>
        <Link to="/create">
          <button className="btn-submit" style={{ marginTop: 0 }}>
            + Nouveau
          </button>
        </Link>
      </header>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {!loading && posts.length === 0 && !error ? (
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          Aucun post. Soyez le premier !
        </div>
      ) : (
        posts.map((post) => (

          <div key={post.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '10px 15px', fontWeight: 'bold', borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
              <Link to={`/profile/${post.id_user}`} style={{ padding: '10px 15px', fontWeight: 'bold', borderBottom: '1px solid #efefef' }}>@{post.pseudo} </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <p style={{ margin: 0, padding: 0, fontSize: '1em', color: '#8e8e8e' }}>{getTotalLikes(post)}</p>
                  <HeartIcon 
                    fill={post.liked_by?.includes(user?.id || '') ? 'red' : 'none'} 
                    stroke={post.liked_by?.includes(user?.id || '') ? 'red' : 'black'}
                    size={20} 
                  />
                </button>
                <button onClick={() => openCommentModal(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <MessageCircleIcon stroke="black" size={20} />
                </button>
              </div>
            </div>

            {/* Image */}
            {post.image && (
              <img 
                src={post.image} 
                alt="Post content" 
                style={{ width: '100%', display: 'block', objectFit: 'cover' }} 
              />
            )}

            {/* Contenu */}
            <div style={{ padding: '15px' }}>
              <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 10px 0' }}>{post.content}</p>
              
              <div style={{ fontSize: '0.85em', color: '#8e8e8e', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <span>{new Date(post.date_creation).toLocaleDateString()}</span>
                <Link to={`/post/${post.id}`} style={{ color: '#0095f6', textDecoration: 'none', fontWeight: 'bold' }}>
                  Voir détails &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Bouton Charger Plus */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {loading && <p>Chargement...</p>}
        
        {!loading && hasMore && (
          <button 
            onClick={handleLoadMore} 
            className="btn-submit"
            style={{ width: '100%' }}
          >
            Charger plus
          </button>
        )}
        
        {!loading && !hasMore && posts.length > 0 && (
          <p style={{ color: '#8e8e8e', marginTop: '10px' }}>Vous avez tout vu !</p>
        )}
      </div>

      {/* Modal commentaire */}
      {commentModal.open && (
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
          onClick={closeCommentModal}
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
              <button onClick={closeCommentModal} className="btn-submit" style={{ flex: 1 }}>
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