import { Link } from "react-router-dom";
import { Home, Plus, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LeftMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <header className="app-header">
      <div className="app-header-center">
        <Link to="/" className="app-menu-link" title="Feed">
          <Home size={24} />
        </Link>
        <Link to="/create" className="app-menu-link" title="Créer un post">
          <Plus size={24} />
        </Link>
        <Link to={`/profile/${user.id}`} className="app-menu-link" title="Profil">
          <User size={24} />
        </Link>
      </div>
      <div className="app-header-bottom">
        <button type="button" onClick={logout} className="app-logout" title="Déconnexion">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
