import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Search, Users, X, ChevronUp, ChevronDown, Sparkles, Crown, BadgeCheck, UserPlus2, FilterX } from "lucide-react";
import { createCustomer, listCustomers, type CustomerRecord } from "@/services/customerService";
import Loader from "@/components/ui/Loader";
import { ModernSelect } from "@/components/ui/ModernSelect";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

type TierFilter = "All" | "Fresh" | "Prime" | "Emerald";
type SortField = "name" | "customerId" | "phone" | "tier" | "points";
type SortDirection = "asc" | "desc";

const tierOptions: TierFilter[] = ["All", "Fresh", "Prime", "Emerald"];

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<TierFilter>("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    let active = true;
    setLoading(true);
    listCustomers()
      .then((res) => {
        if (!active) return;
        setCustomers(res.customers);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load customers");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = customers.filter((customer) => {
      const tierMatch = tier === "All" || customer.tier === tier;
      const queryMatch =
        q.length === 0 ||
        customer.name.toLowerCase().includes(q) ||
        (customer.email ?? "").toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        customer.customerId.toLowerCase().includes(q);

      return tierMatch && queryMatch;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "customerId":
          aValue = a.customerId.toLowerCase();
          bValue = b.customerId.toLowerCase();
          break;
        case "phone":
          aValue = a.phone.toLowerCase();
          bValue = b.phone.toLowerCase();
          break;
        case "tier":
          aValue = a.tier;
          bValue = b.tier;
          break;
        case "points":
          aValue = a.points;
          bValue = b.points;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [customers, query, tier, sortField, sortDirection]);

  const counts = useMemo(() => {
    return {
      total: customers.length,
      fresh: customers.filter((item) => item.tier === "Fresh").length,
      prime: customers.filter((item) => item.tier === "Prime").length,
      emerald: customers.filter((item) => item.tier === "Emerald").length,
    };
  }, [customers]);

  const handleCreateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);
    setCreating(true);

    try {
      const payload = {
        name: createForm.name.trim(),
        email: createForm.email.trim() || undefined,
        phone: createForm.phone.trim(),
      };
      const result = await createCustomer(payload);
      setCustomers((prev) => [result.customer, ...prev]);
      setCreateForm({ name: "", email: "", phone: "" });
      setShowCreate(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create customer");
    } finally {
      setCreating(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setQuery("");
    setTier("All");
    setSortField("name");
    setSortDirection("asc");
  };

  const activeFilterCount = (query.trim() ? 1 : 0) + (tier !== "All" ? 1 : 0);

  return (
    <div className="space-y-5 text-sm text-black">
      <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-[0_24px_80px_-45px_rgba(16,185,129,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Member Operations</p>
            <p className="mt-1 text-2xl font-display text-brand-900">Customer Directory</p>
            <p className="mt-1 text-sm text-black">View, search, and onboard loyalty members.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-2 text-right shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Visible Records</p>
              <p className="text-lg font-semibold text-emerald-700">{filteredCustomers.length}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <UserPlus2 className="h-4 w-4" />
              Create Customer
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Members" value={counts.total} icon={<Users className="h-4 w-4" />} accent="emerald" />
        <SummaryCard label="Fresh Tier" value={counts.fresh} icon={<Sparkles className="h-4 w-4" />} accent="lime" />
        <SummaryCard label="Prime Tier" value={counts.prime} icon={<BadgeCheck className="h-4 w-4" />} accent="sky" />
        <SummaryCard label="Emerald Tier" value={counts.emerald} icon={<Crown className="h-4 w-4" />} accent="emerald" />
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white/80 p-4 shadow-[0_16px_50px_-38px_rgba(15,23,42,0.25)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-black">Search, Filter and Sort</p>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-brand-50"
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
              placeholder="Search by name, email, phone, or customer ID"
              className="w-full rounded-xl border border-brand-200 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-900 outline-none ring-emerald-300 transition focus:ring-2"
            />
          </label>

          <ModernSelect
            value={tier}
            onChange={(event) => setTier(event.target.value as TierFilter)}
          >
            {tierOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All Tiers" : `${option} Tier`}
              </option>
            ))}
          </ModernSelect>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} title="Unable to load customers" className="text-left" />
        ) : filteredCustomers.length === 0 ? (
          <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-8 text-center">
            <Users className="mx-auto mb-2 h-6 w-6 text-brand-500" />
            <p className="font-medium text-brand-900">No customers found</p>
            <p className="text-black">Try adjusting filters or create a new customer.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-xl border border-brand-100">
              <table className="min-w-full bg-white text-left text-sm">
                <thead className="bg-brand-50/70 text-xs uppercase tracking-[0.12em] text-black">
                  <tr>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-brand-900"
                      >
                        Customer
                        {sortField === "name" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("customerId")}
                        className="flex items-center gap-1 hover:text-brand-900"
                      >
                        Customer ID
                        {sortField === "customerId" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("phone")}
                        className="flex items-center gap-1 hover:text-brand-900"
                      >
                        Contact
                        {sortField === "phone" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("tier")}
                        className="flex items-center gap-1 hover:text-brand-900"
                      >
                        Tier
                        {sortField === "tier" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleSort("points")}
                        className="flex items-center gap-1 hover:text-brand-900 ml-auto"
                      >
                        Points
                        {sortField === "points" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-t border-brand-100 transition hover:bg-emerald-50/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            {initials(customer.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-brand-900">{customer.name}</p>
                            <p className="text-xs text-black">{customer.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-800">{customer.customerId}</td>
                      <td className="px-4 py-3 text-black">{customer.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tierClass(customer.tier)}`}>
                          {customer.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-900">
                        {new Intl.NumberFormat("en-SG").format(customer.points)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {filteredCustomers.map((customer) => (
                <div key={customer._id} className="rounded-xl border border-brand-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {initials(customer.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-900">{customer.name}</p>
                        <p className="text-xs text-black">{customer.email || "No email"}</p>
                        <p className="text-xs text-brand-800 mt-1">{customer.customerId}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tierClass(customer.tier)}`}>
                        {customer.tier}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-brand-900">{new Intl.NumberFormat("en-SG").format(customer.points)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-black">Contact: {customer.phone}</p>
                    <div className="flex items-center gap-2">
                      {/* actions (e.g., view/edit) can go here */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-5 shadow-2xl max-h-[90vh] overflow-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-900">Create Customer</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-full p-1 text-black transition hover:bg-brand-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">Full Name</span>
                <input
                  required
                  minLength={2}
                  value={createForm.name}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">Email (Optional)</span>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Leave blank if unavailable"
                  className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                />
                <p className="mt-1 text-xs text-black">You can create the customer without an email address.</p>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black">Phone</span>
                <input
                  required
                  minLength={8}
                  value={createForm.phone}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm text-brand-900 outline-none ring-brand-300 transition focus:ring-2"
                />
              </label>

              {createError && (
                <ErrorMessage
                  error={createError}
                  title="Unable to create customer"
                  compact
                  hideTitle
                  className="w-full"
                />
              )}

              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
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
                  className="w-full sm:w-auto rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon, accent }: { label: string; value: number; icon: ReactNode; accent: "emerald" | "lime" | "sky" }) {
  const tone =
    accent === "lime"
      ? "border-lime-100 bg-lime-50/60 text-lime-700"
      : accent === "sky"
      ? "border-sky-100 bg-sky-50/60 text-sky-700"
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

function initials(name: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "NA";
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
}

function tierClass(tier: CustomerRecord["tier"]) {
  if (tier === "Emerald") return "bg-emerald-100 text-emerald-800";
  if (tier === "Prime") return "bg-blue-100 text-blue-800";
  return "bg-brand-100 text-brand-800";
}

