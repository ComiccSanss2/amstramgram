import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProfilService } from "../services/profil.service";
import type { User } from "../types";
import { Link, useParams } from 'react-router-dom';
import type { Post } from '../types/index';
import { PostService } from '../services/post.services.js';


export default function ProfilePage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const profileId = id ?? user?.id ?? "";

  useEffect(() => {
  if (!user || !profileId) return;

  const load = async () =>{
    try{
      setLoading(true);
      setError(null);

      const loadedProfile = await ProfilService.getById(profileId);
      setProfile(loadedProfile);

      const isMyProfile = profileId === user.id;
      const isFollower = loadedProfile.followers.includes(user.id);
      const canSeePosts = isMyProfile || !loadedProfile.bPrivate || isFollower;

      if (!canSeePosts){
        setPosts([]);
        return;
      }

      
      let page = 1;
      let hasMore = true;

      const allPosts: Post[] =[];

      while (hasMore) {
        const res = await PostService.getAll(page);

        const pagePosts: Post[] = res?.data ?? [];
        allPosts.push(...pagePosts);

        hasMore = Boolean(res?.meta?.hasMore);
        page += 1;
      }
      const profilPosts = allPosts.filter((post) => post.id_user === profileId);
      setPosts(profilPosts)

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [user, profileId]);

  if (!user) return <p> Veuillez vous connecter.</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loading || !profile) return <p>Chargement...</p>;

  const isMyProfile = profileId === user.id
  const isFollower = profile.followers.includes(user.id)
  const isPrivate = profile.bPrivate
  const canSeePosts = isMyProfile || !isPrivate || isFollower;

  return (
    <div className="profile-container">
      <section className="profile-info">
        <h2>{profile.pseudo}</h2>

        {isMyProfile && <p>{profile.email}</p>}

        <div className="stats">
          <span>{profile.followers.length} abonnés</span>
          <span> · </span>
          <span>{profile.following.length} abonnements</span>
        </div>

        {!isMyProfile && (
          <p style={{ marginTop: 8, color: "#666" }}>
            {isPrivate ? "Compte privé" : "Compte public"}
          </p>
        )}
      </section>

      <hr />
      
      <section className="profile-posts">
        <h3>{isMyProfile ? "Mes posts" : "Posts"}</h3>

        {!canSeePosts ? (
          <div className="card">
            Ce compte est privé. Abonne-toi pour voir ses posts.
          </div>
        ) : posts.length === 0 ? (
        <div className="card">Pas encore de posts.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <Link to={`/profile/${post.id_user}`} style={{ padding: '10px 15px', fontWeight: 'bold', borderBottom: '1px solid #efefef' }}>@{post.pseudo} </Link>

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
      </section>
    </div>
  );
}
