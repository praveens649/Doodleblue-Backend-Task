import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">
        <span className="brand-mark">dB</span>
        doodleBlue
      </Link>

      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {user?.role === "faculty" && (
          <>
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/faculties">Faculties</NavLink>
            <NavLink to="/users">All Users</NavLink>
          </>
        )}
      </div>

      <div className="nav-user">
        <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        <span className="nav-username">{user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
