import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [bPrivate, setBPrivate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (isLogin) {
        await login(email, mdp);
      } else {
        await register(email, mdp, pseudo, bPrivate);
      }
      navigate("/", { replace: true });
    } catch {
      // error is set in context
    }
  };

  const switchMode = () => {
    setIsLogin((v) => !v);
    clearError();
    setMdp("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">Amstramgram</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}
          {!isLogin && (
            <input
              type="text"
              placeholder="Pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required={!isLogin}
              className="auth-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
            className="auth-input"
          />
          {!isLogin && (
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={bPrivate}
                onChange={(e) => setBPrivate(e.target.checked)}
              />
              Compte privé
            </label>
          )}
          <button type="submit" className="btn-submit">
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <button type="button" className="auth-switch" onClick={switchMode}>
          {isLogin
            ? "Pas de compte ? Inscris-toi"
            : "Tu as un compte ? Connexion"}
        </button>
      </div>
    </div>
  );
}
