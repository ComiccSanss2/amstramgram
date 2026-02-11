import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { ProfilService } from "../services/profil.service";
import type { User } from "../types";
import "./SearchPage.css";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const q = searchParams.get("q") ?? "";

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    ProfilService.search(q)
      .then((r) => setResults(r.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSubmit} className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          autoFocus
        />
      </form>

      {!q.trim() ? (
        <p className="search-hint">Saisis un pseudo pour rechercher</p>
      ) : loading ? (
        <p className="search-hint">Chargement...</p>
      ) : results.length === 0 ? (
        <p className="search-hint">Aucun résultat pour &quot;{q}&quot;</p>
      ) : (
        <ul className="search-results">
          {results.map((user) => (
            <li key={user.id}>
              <Link to={`/profile/${user.id}`} className="search-result-item">
                <span className="search-result-avatar">{user.pseudo?.[0]?.toUpperCase()}</span>
                <div className="search-result-info">
                  <span className="search-result-pseudo">@{user.pseudo}</span>
                  {user.bPrivate && <span className="search-result-private">Compte privé</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
