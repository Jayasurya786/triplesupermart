import { Outlet, useNavigate } from "react-router-dom";
import { Seo } from "@/seo/Seo";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import NotificationPoller from "@/layouts/NotificationPoller";
import { Sidebar, SidebarItem } from "@/components/ui/Sidebar";
import { useAppDispatch } from "@/store/hooks";
import { clearSession } from "@/store/slices/authSlice";
import { LayoutDashboard, User, Gift, Wallet, Bell } from "lucide-react";

  

export function PortalLayout() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // polling and toast handled by NotificationPoller component below

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

  const notificationsIcon = (
    <div className="relative">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white bg-emerald-600 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );

  const items: SidebarItem[] = [
    { label: "Dashboard", to: "/portal", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Profile", to: "/portal/profile", icon: <User className="w-5 h-5" /> },
    { label: "Rewards", to: "/portal/rewards", icon: <Gift className="w-5 h-5" /> },
    { label: "Membership Card", to: "/portal/card", icon: <Wallet className="w-5 h-5" /> },
    { label: "Notifications", to: "/portal/notifications", icon: notificationsIcon },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
        <Seo title="Customer Portal" description="Manage your loyalty profile and rewards." />
        <Sidebar
          items={items}
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
            aria-label="Open portal menu"
          >
            Menu
          </button>
        )}
        <main className="flex-1 overflow-auto">
          <div className="px-6 md:px-10 py-10">
            <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-3xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-900 shadow-sm transition hover:bg-brand-50"
              >
                Menu
              </button>
              <span className="text-sm font-semibold text-brand-900">Customer Portal</span>
            </div>
            <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.15)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-brand-600">Customer Portal</p>
                <h1 className="mt-3 text-3xl font-display text-brand-900">Hello, {user?.name ?? "Member"}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">Everything you need for loyalty, rewards, and your membership card is available here.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 px-5 py-4 text-sm text-brand-700 shadow-sm">
                Member since <span className="font-semibold text-brand-900">May 2026</span>
              </div>
            </div>
          </div>
          <section className="bg-white/90 border border-slate-200 rounded-[2rem] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.12)]">
            <Outlet />
          </section>
        </div>
      </main>
      </div>
      <NotificationPoller onUnread={setUnreadCount} />
    </>
  );
}
