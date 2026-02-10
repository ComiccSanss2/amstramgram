import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LeftMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="app-header">
      <div className="app-header-center">
        <Link to="/" className="app-menu-link" title="Feed">
          Feed
        </Link>
        <Link to="/create" className="app-menu-link" title="Créer un post">
          +
        </Link>
        <Link to="/profile" className="app-menu-link" title="Profil">
          Profil
        </Link>
      </div>
      <div className="app-header-bottom">
        <span>{user.pseudo}</span>
        <button type="button" onClick={logout} className="app-logout">
          Déconnexion
        </button>
      </div>
    </header>
  );
}
