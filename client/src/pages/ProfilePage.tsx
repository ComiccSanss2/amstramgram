import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProfilService } from "../services/profil.service";
import type { User } from "../types";
import { Link, useParams } from 'react-router-dom';
import type { Post } from '../types/index';
import { PostService } from '../services/post.services.js';
import { LockKeyholeIcon, LockKeyholeOpenIcon} from 'lucide-react';
import "./ProfilePage.css"


export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

const hanleFollow = async () => {
  if (!user || !profile) return;

  try {
    if (isFollower) {
      await ProfilService.unfollow(profile.id, user.id);
      setProfile((prev) => prev?({...prev,followers: prev.followers.filter(id => id !== user.id)}):null);
    } else{
      await ProfilService.follow(profile.id,user.id);
      setProfile((prev) => prev?({...prev,followers: [...prev.followers, user.id]}):null);
    }
  } catch (e) {
    console.error("Erreur follow/unfollow",e);
  }
};
  const handleDelete = async (postId: string) => {
    if (!confirm("Supprimer ce post ?")) return;
    try {
      await PostService.delete(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p> Veuillez vous connecter.</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loading || !profile) return <p>Chargement...</p>;

  const isMyProfile = profileId === user.id
  const isFollower = profile.followers.includes(user.id)
  const isPrivate = profile.bPrivate
  const canSeePosts = isMyProfile || !isPrivate || isFollower;

  const handleOpenEdit = () => setEditModalOpen(true);
  const handleCloseEdit = () => setEditModalOpen(false);

  return (
    <div className="profile-container">
      <section className="profileHeader">
        <div className="profileCover"></div>

        <div className="profileHeaderContent">
          <div className="profileAvatar">
            <span>{profile.pseudo?.[0]?.toUpperCase()}</span>
          </div>

          <div className="profileInfos">
            <div className="profileTopRow">
              <h2>{profile.pseudo} {isPrivate ? !isFollower ? <LockKeyholeIcon size={18}/> : <LockKeyholeOpenIcon size={18}/>: ""}</h2>
              <div className="profileActions">
                {isMyProfile ? (
                  <button className="btn secondary" onClick={handleOpenEdit}>Edit</button>
                ) : (
                  <>
                    <button className={`btn ${isFollower ? 'secondary' : 'primary'}`} onClick={hanleFollow}>{isFollower ? "Unfollow" : "Follow"}</button>
                  </>
                )}
              </div>
            </div>

            {isMyProfile && (
              <p style={{ margin: '5px 0', color: '#666' }}>{profile.email}</p>
            )}

            <div className="profileStats">
              <p><b>{posts.length}</b> Posts</p>
              <p><b>{profile.followers.length}</b> Followers</p>
              <p><b>{profile.following.length}</b> Following</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="profile-posts">
        <h3>{isMyProfile ? "Mes posts" : "Posts"}</h3>

        {!canSeePosts ? (
          <span>
            Ce compte est privé. Abonne-toi pour voir ses posts.
          </span>
        ) : posts.length === 0 ? (
        <div className="card">Pas encore de posts.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
              <div style={{ padding: '10px 15px', fontWeight: 'bold', borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 10px 0' }}>{post.content}</p>
              </div>
              
              <div style={{ fontSize: '0.85em', color: '#8e8e8e', display: 'flex', justifyContent: 'space-between', padding: '10px 10px', borderTop: '1px solid #efefef' }}>
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

      {editModalOpen && profile && (
        <EditProfileModal
          profile={profile}
          onClose={handleCloseEdit}
          onSuccess={async (updated) => {
            setProfile(updated);
            await refreshUser();
            handleCloseEdit();
          }}
        />
      )}
    </div>
  );
}

function EditProfileModal({
  profile,
  onClose,
  onSuccess,
}: {
  profile: User;
  onClose: () => void;
  onSuccess: (updated: User) => void | Promise<void>;
}) {
  const [email, setEmail] = useState(profile.email);
  const [pseudo, setPseudo] = useState(profile.pseudo);
  const [bPrivate, setBPrivate] = useState(profile.bPrivate);
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEmail(profile.email);
    setPseudo(profile.pseudo);
    setBPrivate(profile.bPrivate);
    setMdp("");
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data: { email?: string; pseudo?: string; bPrivate?: boolean; mdp?: string } = {
        email: email.trim(),
        pseudo: pseudo.trim(),
        bPrivate,
      };
      if (mdp.trim()) data.mdp = mdp.trim();
      const updated = await ProfilService.update(data);
      await onSuccess(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "90%", maxWidth: "400px", padding: "20px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Modifier le profil</h3>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red", margin: "0 0 10px 0", fontSize: "0.9em" }}>{error}</p>}
          <input
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
            className="auth-input"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe (optionnel)"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            className="auth-input"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <input type="checkbox" checked={bPrivate} onChange={(e) => setBPrivate(e.target.checked)} />
            Compte privé
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} className="btn-submit" style={{ flex: 1, background: "#8e8e8e" }}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" style={{ flex: 1 }} disabled={submitting || !pseudo.trim() || !email.trim()}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
