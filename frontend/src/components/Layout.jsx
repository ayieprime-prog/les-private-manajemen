import { Building2, Users, LogOut, CalendarClock } from "lucide-react";

const ROLE_LABEL = {
  ADMIN_PUSAT: "Admin Pusat",
  ADMIN_CABANG: "Admin Cabang",
  TUTOR: "Tutor",
  ORTU: "Orang Tua",
};

export default function Layout({ user, page, onNavigate, onLogout, children }) {
  const menu = [
    { key: "cabang", label: "Cabang", icon: Building2, roles: ["ADMIN_PUSAT"] },
    { key: "users", label: "Pengguna", icon: Users, roles: ["ADMIN_PUSAT", "ADMIN_CABANG"] },
    { key: "jadwal", label: "Penjadwalan", icon: CalendarClock, roles: ["ADMIN_PUSAT", "ADMIN_CABANG", "TUTOR"] },
  ].filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-slate-800 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <p className="font-semibold">Les Private</p>
          <p className="text-xs text-slate-300">{user.nama}</p>
          <p className="text-xs text-slate-400">{ROLE_LABEL[user.role]}</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${
                page === item.key ? "bg-slate-700" : "hover:bg-slate-700/50"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-3 text-sm text-slate-300 hover:bg-slate-700/50"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
