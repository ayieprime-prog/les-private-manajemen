import { useEffect, useState } from "react";
import { api } from "../api";

const ROLE_LABEL = {
  ADMIN_PUSAT: "Admin Pusat",
  ADMIN_CABANG: "Admin Cabang",
  TUTOR: "Tutor",
  ORTU: "Orang Tua",
};

export default function UsersPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [cabangList, setCabangList] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "TUTOR",
    cabangId: "",
    mapel: "",
    tarifPerSesi: "",
  });
  const [error, setError] = useState("");

  async function load() {
    setUsers(await api.getUsers());
    if (currentUser.role === "ADMIN_PUSAT") {
      setCabangList(await api.getCabang());
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createUser({
        ...form,
        tarifPerSesi: form.tarifPerSesi ? Number(form.tarifPerSesi) : 0,
      });
      setForm({ nama: "", email: "", password: "", role: "TUTOR", cabangId: "", mapel: "", tarifPerSesi: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.deleteUser(id);
    load();
  }

  const roleOptions =
    currentUser.role === "ADMIN_PUSAT"
      ? ["ADMIN_PUSAT", "ADMIN_CABANG", "TUTOR", "ORTU"]
      : ["TUTOR", "ORTU"];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-800">Manajemen Pengguna</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 grid grid-cols-2 gap-3">
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>

        {currentUser.role === "ADMIN_PUSAT" && form.role !== "ADMIN_PUSAT" && (
          <select
            value={form.cabangId}
            onChange={(e) => setForm({ ...form, cabangId: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
            required
          >
            <option value="">Pilih Cabang</option>
            {cabangList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        )}

        {form.role === "TUTOR" && (
          <>
            <input
              placeholder="Mapel yang diajar"
              value={form.mapel}
              onChange={(e) => setForm({ ...form, mapel: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Tarif per sesi (Rp)"
              type="number"
              value={form.tarifPerSesi}
              onChange={(e) => setForm({ ...form, tarifPerSesi: e.target.value })}
              className="border rounded px-3 py-2 text-sm"
            />
          </>
        )}

        <button className="col-span-2 bg-slate-800 text-white rounded px-4 py-2 text-sm font-medium">
          Tambah Pengguna
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-lg shadow divide-y">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-slate-800">{u.nama}</p>
              <p className="text-xs text-slate-500">{u.email} · {ROLE_LABEL[u.role]}</p>
            </div>
            <button onClick={() => handleDelete(u.id)} className="text-sm text-red-600 hover:underline">
              Hapus
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">Belum ada pengguna.</p>}
      </div>
    </div>
  );
}
