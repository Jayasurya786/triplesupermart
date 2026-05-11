import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Plus, Search, CalendarDays, Megaphone, X, Trash2, Sparkles, FilterX, BadgeCheck, CircleSlash } from "lucide-react";
import { createOffer, deleteOffer, listOffers, type OfferRecord } from "@/services/offerService";
import { ModernSelect } from "@/components/ui/ModernSelect";
import Loader from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

type StatusFilter = "all" | "active" | "inactive";

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Offers" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    active: true,
    startsAt: "",
    endsAt: "",
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    listOffers()
      .then((res) => {
        if (!active) return;
        setOffers(res.offers);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load offers");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredOffers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offers.filter((offer) => {
      const statusMatch =
        status === "all" ||
        (status === "active" && offer.active) ||
        (status === "inactive" && !offer.active);
      const queryMatch =
        q.length === 0 ||
        offer.title.toLowerCase().includes(q) ||
        (offer.detail ?? "").toLowerCase().includes(q);
      return statusMatch && queryMatch;
    });
  }, [offers, query, status]);

  const stats = useMemo(() => {
    const activeCount = offers.filter((item) => item.active).length;
    return {
      total: offers.length,
      active: activeCount,
      inactive: offers.length - activeCount,
    };
  }, [offers]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);
    setCreating(true);

    try {
      const payload = {
        title: form.title.trim(),
        detail: form.detail.trim() || undefined,
        active: form.active,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      };
      const res = await createOffer(payload);
      setOffers((prev) => [res.offer, ...prev]);
      setShowCreate(false);
      setForm({ title: "", detail: "", active: true, startsAt: "", endsAt: "" });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create offer");
    } finally {
      setCreating(false);
    }
  };

  const handleRemove = async (offerId: string) => {
    setPendingRemoveId(offerId);
  };

  const handleConfirmRemove = async (offerId: string) => {
    setRemovingId(offerId);
    setError(null);

    try {
      await deleteOffer(offerId);
      setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
      setPendingRemoveId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove offer");
    } finally {
      setRemovingId(null);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("all");
  };

  const activeFilterCount = (query.trim() ? 1 : 0) + (status !== "all" ? 1 : 0);

  return (
    <div className="space-y-5 text-sm text-black">
      <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-4 sm:p-5 shadow-[0_24px_80px_-45px_rgba(16,185,129,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Campaign Studio</p>
            <p className="mt-1 text-xl sm:text-2xl font-display text-brand-900">Offers & Campaigns</p>
            <p className="mt-1 text-sm text-black">Create, schedule, and manage promotional campaigns.</p>
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-2 text-left sm:text-right shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Visible Offers</p>
              <p className="text-lg font-semibold text-emerald-700">{filteredOffers.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Create Offer
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Offers" value={stats.total} icon={<Sparkles className="h-4 w-4" />} accent="emerald" />
        <StatCard label="Active" value={stats.active} icon={<BadgeCheck className="h-4 w-4" />} accent="lime" />
        <StatCard label="Inactive" value={stats.inactive} icon={<CircleSlash className="h-4 w-4" />} accent="slate" />
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white/80 p-4 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.25)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-black">Search and Filter</p>
          <div className="flex w-full sm:w-auto items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-brand-50"
            >
              <FilterX className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search offers by title or description"
              className="w-full rounded-xl border border-brand-200 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
            />
          </label>
          <ModernSelect
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </ModernSelect>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} title="Unable to load offers" className="text-left" />
        ) : filteredOffers.length === 0 ? (
          <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-8 text-center">
            <Megaphone className="mx-auto mb-2 h-6 w-6 text-brand-500" />
            <p className="font-medium text-brand-900">No offers found</p>
            <p>Try different filters or create a new offer.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-xl border border-brand-100">
              <table className="min-w-full bg-white text-left text-sm">
              <thead className="bg-brand-50/70 text-xs uppercase tracking-[0.12em] text-black">
                <tr>
                  <th className="px-4 py-3">Offer</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr key={offer._id} className="border-t border-brand-100 transition hover:bg-emerald-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Megaphone className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-brand-900">{offer.title}</p>
                          <p className="text-xs text-black">{offer.detail || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-black">
                      {offer.startsAt || offer.endsAt ? (
                        <div>
                          <p>{offer.startsAt ? formatDate(offer.startsAt) : "Now"}</p>
                          <p className="text-xs text-black">to {offer.endsAt ? formatDate(offer.endsAt) : "No end"}</p>
                        </div>
                      ) : (
                        <span className="text-black">Always on</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${offer.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                        {offer.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black">{offer.createdAt ? formatDate(offer.createdAt) : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      {pendingRemoveId === offer._id ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmRemove(offer._id)}
                            disabled={removingId === offer._id}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {removingId === offer._id ? "Removing..." : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingRemoveId(null)}
                            disabled={removingId === offer._id}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemove(offer._id)}
                          disabled={removingId === offer._id}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {filteredOffers.map((offer) => (
                <div key={offer._id} className="rounded-xl border border-brand-100 bg-white p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Megaphone className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-900">{offer.title}</p>
                    <p className="text-xs text-black mt-0.5">{offer.detail || "No description"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black">
                      <span>{offer.startsAt ? formatDate(offer.startsAt) : "Now"}</span>
                      <span>to</span>
                      <span>{offer.endsAt ? formatDate(offer.endsAt) : "No end"}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${offer.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                        {offer.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {pendingRemoveId === offer._id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleConfirmRemove(offer._id)}
                        disabled={removingId === offer._id}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {removingId === offer._id ? "Removing..." : "Confirm Remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingRemoveId(null)}
                        disabled={removingId === offer._id}
                        className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemove(offer._id)}
                      disabled={removingId === offer._id}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/35 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-4 sm:p-5 shadow-2xl my-4 sm:my-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-brand-900">Create Offer</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-full p-1 text-black transition hover:bg-brand-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">Offer Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">Description</span>
                <textarea
                  rows={3}
                  value={form.detail}
                  onChange={(event) => setForm((prev) => ({ ...prev, detail: event.target.value }))}
                  className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">Start Date</span>
                  <input
                    type="date"
                    value={form.startsAt}
                    onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
                    className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">End Date</span>
                  <input
                    type="date"
                    value={form.endsAt}
                    onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
                    className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                  />
                </label>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-brand-800">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
                />
                Set as active offer
              </label>

              {createError && (
                <ErrorMessage
                  error={createError}
                  title="Unable to create offer"
                  compact
                  hideTitle
                  className="w-full"
                />
              )}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="w-full sm:w-auto rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-black transition hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  <CalendarDays className="h-4 w-4" />
                  {creating ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent: "emerald" | "lime" | "slate";
}) {
  const tone =
    accent === "lime"
      ? "border-lime-100 bg-lime-50/60 text-lime-700"
      : accent === "slate"
      ? "border-slate-200 bg-slate-50/70 text-slate-700"
      : "border-emerald-100 bg-emerald-50/60 text-emerald-700";

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.14em]">{label}</p>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80">{icon}</span>
      </div>
      <p className="mt-1 text-2xl font-display text-brand-900">{new Intl.NumberFormat("en-US").format(value)}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

