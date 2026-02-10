import { useAuth } from "../contexts/AuthContext";


export default function ProfilePage() {

  const { user } = useAuth();

 
  if (!user) return <p>Please log in</p>;

  return (
    <div className="profile-container">
      <section className="profile-info">
        <h2>{user.pseudo}</h2>
        <p>{user.email}</p>
        <div className="stats">
        
          <span>{user.followers.length} followers</span>
          <span>{user.following.length} following</span>
        </div>
      </section>

      <hr />

      <section className="profile-posts">
        <h3>My Posts</h3>
        <p>no Posts yet</p>
      </section>
    </div>
  );
}