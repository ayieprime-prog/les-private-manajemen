const BASE = process.env.VITE_API_URL || "https://backend-production-25cb.up.railway.app";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request gagal (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request("/auth/me"),
  getCabang: () => request("/cabang"),
  createCabang: (data) => request("/cabang", { method: "POST", body: JSON.stringify(data) }),
  updateCabang: (id, data) =>
    request(`/cabang/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCabang: (id) => request(`/cabang/${id}`, { method: "DELETE" }),
  getUsers: () => request("/users"),
  createUser: (data) => request("/users", { method: "POST", body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
