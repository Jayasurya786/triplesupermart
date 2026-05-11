import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Seo } from "@/seo/Seo";
import { Sidebar, SidebarItem } from "@/components/ui/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { clearSession } from "@/store/slices/authSlice";
import { BarChart3, Users, TrendingUp, Settings, Award, Trophy } from "lucide-react";

const navItems: SidebarItem[] = [
  { 
    label: "Analytics", 
    to: "/admin/analytics",
    icon: <BarChart3 className="w-5 h-5" />
  },
  { 
    label: "Customers", 
    to: "/admin/customers",
    icon: <Users className="w-5 h-5" />
  },
  { 
    label: "Redemptions", 
    to: "/admin/redemptions",
    icon: <Trophy className="w-5 h-5" />
  },
  { 
    label: "Offers", 
    to: "/admin/offers",
    icon: <TrendingUp className="w-5 h-5" />
  },
  { 
    label: "Redeem",
    to: "/admin/redeem",
    icon: <Award className="w-5 h-5" />
  },
  { 
    label: "Loyalty", 
    to: "/admin/loyalty",
    icon: <Settings className="w-5 h-5" />
  },
];

export function AdminLayout() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearSession());
    navigate("/");
  };

  const handleNavigate = (to: string) => {
    navigate(to);
  };

  return (
    <div className="min-h-screen md:flex">
      <Seo title="Admin Portal" description="Manage customers, offers, and loyalty configuration." />
      <Sidebar
        items={navItems}
        user={user ? { name: user.name, email: user.email } : undefined}
        onLogout={handleLogout}
        onNavigate={(to) => {
          handleNavigate(to);
          setSidebarOpen(false);
        }}
        showFooter={false}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-5 right-5 z-30 rounded-full border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-900 shadow-lg transition hover:bg-brand-50 md:hidden"
          aria-label="Open admin menu"
        >
          Menu
        </button>
      )}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-10 pb-24 md:pb-10">
          <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-3xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-brand-50"
            >
              Menu
            </button>
            <span className="text-sm font-semibold text-brand-900">Admin</span>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-display text-brand-800">Admin Command Center</h1>
            <p className="text-sm text-brand-700">Operational visibility for Triple N Supermart.</p>
          </div>
          <section className="bg-white/70 border border-white/60 rounded-3xl p-4 sm:p-6 shadow-glass">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
}
