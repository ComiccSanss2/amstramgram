import { useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import { useState } from "react";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

export default function App() {

  const { user, logout } = useAuth();
 const [currentPage, setCurrentPage] = useState<"Home" | "profile">("Home");
  if (!user) return <AuthPage />;
  return (
    <div className="app-home">
      <header className="app-header">
        <div className="app-header-bottom">
          <nav className="app-nav">
          <button onClick={() => setCurrentPage("Home")}>Home</button>
          <button onClick={() => setCurrentPage("profile")}>Profile</button>
          </nav>
          <span>{user.pseudo}</span>
          <button type="button" onClick={logout} className="app-logout">
            Déconnexion
          </button>
        </div>
      </header>
      <main>
        {currentPage === "Home" ? (
          <div>
            <h1>Home</h1>
            <span>Welcome {user.pseudo}</span>
            <p>Recent posts will appear here.</p>
          </div>
        ) : (
          <ProfilePage />
        )}
        
      </main>
    </div>
  );
}
