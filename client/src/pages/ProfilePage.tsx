import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProfilService } from "../services/profil.service";
import type { User } from "../types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    ProfilService.getById(user.id)
      .then(setProfile)
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
        <p>Pas encore de posts.</p>
      </section>
    </div>
  );
}
