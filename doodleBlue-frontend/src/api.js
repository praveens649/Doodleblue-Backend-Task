const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/users";

async function request(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  signup: (payload) => request("/signup", { method: "POST", body: payload }),
  login: (payload) => request("/login", { method: "POST", body: payload }),
  getProfile: () => request("/profile"),
  updateProfile: (body) => request("/profile", { method: "PATCH", body }),
  getAllUsers: () => request("/all"),
  getStudents: () => request("/students"),
  getFaculties: () => request("/faculties"),
  getStudent: (id) => request(`/students/${id}`),
  updateStudent: (id, body) => request(`/students/${id}`, { method: "PATCH", body }),
  deleteStudent: (id) => request(`/students/${id}`, { method: "DELETE" }),
};
