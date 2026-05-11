import { useState, useEffect } from "react";
import { User, Mail, Smartphone, ShieldCheck, CreditCard, Sparkles, CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";

export function PortalProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // keep form in sync if user changes (hydration / async load)
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">My Profile</p>
        <h2 className="text-2xl sm:text-3xl font-display text-brand-900">Your account details</h2>
        <p className="max-w-2xl text-sm text-slate-600">Keep your contact info up to date and manage your loyalty preferences.</p>
      </div>

      {message && (
        <div className={`rounded-3xl p-4 text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {message.text}
        </div>
      )}

      <GlassCard>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.28em]">Member</p>
                <h3 className="text-2xl font-bold text-slate-900">{user?.name ?? "Member"}</h3>
                <p className="text-xs text-slate-600 mt-1">ID: <span className="font-medium text-slate-900">{user?.customerId ?? "TNS0000"}</span></p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-[0.28em]"><User className="h-4 w-4" /> Full name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none disabled:bg-slate-50 shadow-sm"
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-[0.28em]"><Mail className="h-4 w-4" /> Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none disabled:bg-slate-50 shadow-sm"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-[0.28em]"><Smartphone className="h-4 w-4" /> Phone</span>
              <input
                type="tel"
                name="phone"
                placeholder="Your contact number"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none disabled:bg-slate-50 shadow-sm"
              />
            </label>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto rounded-full bg-gradient-to-br from-brand-600 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto rounded-full bg-gradient-to-br from-brand-600 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                      });
                    }}
                    className="w-full sm:w-auto rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-5 rounded-2xl bg-white/80 p-4 sm:p-6 shadow-sm backdrop-blur-md border border-white/30">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-brand-100 to-emerald-100 p-3">
                <ShieldCheck className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Secure account</p>
                <p className="text-xs text-slate-600">Your details are protected and private.</p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-semibold">Member ID</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{user?.customerId || "TNS0000"}</span>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">Current Tier</span>
                  </div>
                  <span className="rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Fresh</span>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm font-semibold">Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">May 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
