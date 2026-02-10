import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostService } from '../services/post.services';
import type { Post } from '../types/index';

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
            <div style={{ padding: '10px 15px', fontWeight: 'bold', borderBottom: '1px solid #efefef' }}>
              @{post.pseudo}
            </div>

            {/* Image (Si présente) */}
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
    </div>
  );
};