import { useEffect, useState } from "react";
import { api } from "../api";

export default function Students() {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // student being edited
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => {
    api.getStudents()
      .then((data) => setStudents(data.students || []))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, password: "" });
    setMsg({ type: "", text: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const body = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      await api.updateStudent(editing._id, body);
      setEditing(null);
      setMsg({ type: "success", text: `${form.name} updated` });
      load();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Soft-delete ${s.name}? They won't be able to log in.`)) return;
    setDeletingId(s._id);
    try {
      await api.deleteStudent(s._id);
      setMsg({ type: "success", text: `${s.name} was soft-deleted` });
      load();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!students) return <div className="page"><div className="loading">Loading students...</div></div>;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Students</h1>
          <p className="muted">{students.length} active student{students.length !== 1 ? "s" : ""}</p>
        </div>
        <input
          className="search-input"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {filtered.length === 0 ? (
        <div className="empty-state">No students found.</div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="cell-user">
                      <span className="mini-avatar">{s.name[0]?.toUpperCase()}</span>
                      {s.name}
                    </div>
                  </td>
                  <td>{s.email}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="td-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={deletingId === s._id}
                      onClick={() => handleDelete(s)}
                    >
                      {deletingId === s._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit student</h2>
            <p className="muted">Updating {editing.name}</p>
            <form onSubmit={handleSave} className="form">
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
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
