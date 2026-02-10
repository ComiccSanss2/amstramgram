import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProfilService } from "../services/profil.service";
import type { User } from "../types";
import { Link } from 'react-router-dom';
import type { Post } from '../types/index';
import { PostService } from '../services/post.services.js';


export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
  if (!user) return;

  ProfilService.getById(user.id)
    .then(setProfile)
    .then(() => PostService.getAll())
    .then((allPosts) => {
      const userPosts = allPosts.filter((post) => post.id_user === user.id);
      setPosts(userPosts);
    })
    .catch((e) => setError(e instanceof Error ? e.message : "Erreur"));
}, [user]);

  if (!user) return <p>Veuillez vous connecter.</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Chargement...</p>;

  return (
    
    <div className="profile-container">
      <section className="profile-info">
        <h2>{profile.pseudo}</h2>
        <p>{profile.email}</p>
        <div className="stats">
          <span>{profile.followers.length} abonnés</span>
          <span>{profile.following.length} abonnements</span>
        </div>
      </section>
      <hr />
      <section className="profile-posts">
        <h3>Mes posts</h3>
        {posts.length === 0 ? (
        <div className="card">Pas encore de posts.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card">
            <p>{post.content}</p>
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
              <span>{new Date(post.date_creation).toLocaleDateString()}</span>
              <Link to={`/post/${post.id}`}>Voir détails &rarr;</Link>
            </div>
          </div>
        ))
      )}
      </section>
    </div>
  );
}
