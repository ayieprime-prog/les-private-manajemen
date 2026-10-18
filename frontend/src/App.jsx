import { useEffect, useState } from "react";
import { api } from "./api";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import CabangPage from "./pages/CabangPage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((u) => {
        setUser(u);
        setPage(u.role === "ADMIN_PUSAT" ? "cabang" : "users");
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  function handleLogin(u) {
    setUser(u);
    setPage(u.role === "ADMIN_PUSAT" ? "cabang" : "users");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  if (loading) return null;
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Layout user={user} page={page} onNavigate={setPage} onLogout={handleLogout}>
      {page === "cabang" && <CabangPage />}
      {page === "users" && <UsersPage currentUser={user} />}
      {page === "jadwal" && (
        <p className="text-sm text-slate-500">Modul Penjadwalan Sesi belum dibangun.</p>
      )}
    </Layout>
  );
}
