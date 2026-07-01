import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Activity, Key, AlertTriangle, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: Activity },
  { to: "/tokens", label: "Honey Tokens", icon: Key },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Shield className="w-8 h-8 text-cyan-400" />
          <span className="text-xl font-bold text-white">PhantomGate</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-cyan-600/20 text-cyan-400 border border-cyan-800"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-3 truncate">{user?.name}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-sm w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
