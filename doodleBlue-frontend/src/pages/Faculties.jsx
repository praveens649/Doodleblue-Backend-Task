import { useEffect, useState } from "react";
import { api } from "../api";

export default function Faculties() {
  const [faculties, setFaculties] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getFaculties()
      .then((data) => setFaculties(data.faculties || []))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!faculties) return <div className="page"><div className="loading">Loading faculties...</div></div>;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Faculties</h1>
          <p className="muted">{faculties.length} active faculty member{faculties.length !== 1 ? "s" : ""}</p>
        </div>
      </header>

      {faculties.length === 0 ? (
        <div className="empty-state">No faculty members found.</div>
      ) : (
        <div className="user-grid">
          {faculties.map((f) => (
            <div className="user-card" key={f._id}>
              <span className="mini-avatar lg">{f.name[0]?.toUpperCase()}</span>
              <h3>{f.name}</h3>
              <p className="muted">{f.email}</p>
              <div className="user-card-footer">
                <span className="role-badge faculty">faculty</span>
                <span className="muted small">Joined {new Date(f.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
