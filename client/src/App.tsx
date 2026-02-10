import { useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import "./App.css";

export default function App() {
  const { user, logout } = useAuth();
  if (!user) return <AuthPage />;
  return (
    <div className="app-home">
      <header className="app-header">
        <div className="app-header-bottom">
          <span>{user.pseudo}</span>
          <button type="button" onClick={logout} className="app-logout">
            Déconnexion
          </button>
        </div>
      </header>
      <main>
        <p>Bienvenue, {user.pseudo}.</p>
      </main>
    </div>
  );
}
