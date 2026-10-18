import { useEffect, useState } from "react";
import { api } from "../api";

export default function CabangPage() {
  const [cabang, setCabang] = useState([]);
  const [form, setForm] = useState({ nama: "", alamat: "", telepon: "" });
  const [error, setError] = useState("");

  async function load() {
    setCabang(await api.getCabang());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createCabang(form);
      setForm({ nama: "", alamat: "", telepon: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.deleteCabang(id);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-800">Manajemen Cabang</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 flex gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Nama Cabang</label>
          <input
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Alamat</label>
          <input
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Telepon</label>
          <input
            value={form.telepon}
            onChange={(e) => setForm({ ...form, telepon: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
        <button className="bg-slate-800 text-white rounded px-4 py-2 text-sm font-medium">
          Tambah
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-lg shadow divide-y">
        {cabang.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-slate-800">{c.nama}</p>
              <p className="text-xs text-slate-500">{c.alamat || "-"} {c.telepon ? `· ${c.telepon}` : ""}</p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
        {cabang.length === 0 && (
          <p className="px-4 py-6 text-sm text-slate-500">Belum ada cabang.</p>
        )}
      </div>
    </div>
  );
}
