import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { api } from "../api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    api.getProfile()
      .then((data) => {
        setProfile(data.user);
        setForm({ name: data.user.name, email: data.user.email, password: "" });
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      const body = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      const data = await api.updateProfile(body);
      const updated = data.user || data.student;
      setProfile(updated);
      updateUser({ ...user, ...updated });
      setEditing(false);
      setMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!profile) return <div className="page"><div className="loading">Loading profile...</div></div>;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="muted">Your account details</p>
        </div>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        )}
      </header>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="profile-card">
        <div className="profile-avatar">{profile.name?.[0]?.toUpperCase()}</div>

        {!editing ? (
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span>{profile.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role</span>
              <span className={`role-badge ${profile.role}`}>{profile.role}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Member since</span>
              <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="form profile-edit">
            <label>
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              New password <span className="muted small">(leave blank to keep current)</span>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
