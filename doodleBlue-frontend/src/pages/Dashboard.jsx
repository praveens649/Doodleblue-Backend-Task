import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { api } from "../api";

export default function Dashboard() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isFaculty) return;
    Promise.all([api.getStudents(), api.getFaculties()])
      .then(([s, f]) =>
        setStats({
          students: s.students?.length ?? 0,
          faculties: f.faculties?.length ?? 0,
        })
      )
      .catch(() => {});
  }, [isFaculty]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Hello, {user?.name}</h1>
          <p className="muted">
            You are signed in as <span className={`role-badge ${user?.role}`}>{user?.role}</span>
          </p>
        </div>
      </header>

      {isFaculty && stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-num">{stats.students}</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.faculties}</span>
            <span className="stat-label">Faculty members</span>
          </div>
        </div>
      )}

      <div className="card-grid">
        <Link to="/profile" className="action-card">
          <div className="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
            </svg>
          </div>
          <h3>My Profile</h3>
          <p>View and update your account details</p>
        </Link>

        {isFaculty && (
          <>
            <Link to="/students" className="action-card">
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10L12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
                </svg>
              </div>
              <h3>Students</h3>
              <p>View, edit and manage all student accounts</p>
            </Link>

            <Link to="/faculties" className="action-card">
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M8 21h8M12 18v3" />
                </svg>
              </div>
              <h3>Faculties</h3>
              <p>Browse all registered faculty members</p>
            </Link>

            <Link to="/users" className="action-card">
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2.5 20c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5" />
                  <circle cx="17.5" cy="9" r="2.5" />
                  <path d="M21.5 20c0-2.8-1.8-4.4-4-5" />
                </svg>
              </div>
              <h3>All Users</h3>
              <p>See every active account in one place</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
