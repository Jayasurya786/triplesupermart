import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import StyledHeaderButton from "@/components/ui/StyledHeaderButton";
import { SpotlightNavbar } from "@/components/ui/SpotlightNavbar";
import { useHeaderShadow } from "@/hooks/useHeaderShadow";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { clearSession } from "@/store/slices/authSlice";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Offers", href: "/offers" },
  { label: "Loyalty", href: "/loyalty" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const scrolled = useHeaderShadow();
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(clearSession());
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "backdrop-blur-glass bg-white/70 shadow-glass" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-3">
        <NavLink to="/" className="text-lg font-display text-brand-800 font-bold uppercase tracking-widest">
          TRIPLE N SUPERMART
        </NavLink>
        
        <div className="hidden md:flex flex-1 justify-center">
          <SpotlightNavbar items={navItems} />
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          <button
            type="button"
            className="rounded-full border border-brand-200 p-2 text-brand-700 transition hover:bg-brand-50"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="hidden sm:flex flex-wrap items-center gap-3 justify-end">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm font-semibold text-brand-700 hidden sm:block">
                {user.name}
              </span>
              <StyledHeaderButton
                variant="primary"
                onClick={() => navigate(user.role === "admin" || user.role === "staff" ? "/admin" : "/portal")}
              >
                {user.role === "admin" || user.role === "staff" ? "Admin Panel" : "Portal"}
              </StyledHeaderButton>
              <StyledHeaderButton variant="outline" onClick={handleLogout}>
                Logout
              </StyledHeaderButton>
            </>
          ) : (
            <>
              <StyledHeaderButton variant="outline" onClick={() => navigate("/register")}>Register</StyledHeaderButton>
              <StyledHeaderButton variant="primary" onClick={() => navigate("/login")}>Login</StyledHeaderButton>
            </>
          )}
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-100 bg-white/95 px-6 pb-4 shadow-sm">
          <div className="space-y-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-3xl px-4 py-3 text-base font-medium text-brand-900 transition hover:bg-brand-50"
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            {isAuthenticated && user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(user.role === "admin" || user.role === "staff" ? "/admin" : "/portal");
                  }}
                  className="w-full rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                >
                  {user.role === "admin" || user.role === "staff" ? "Admin Panel" : "Portal"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-3xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/register");
                  }}
                  className="w-full rounded-3xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50 transition"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
