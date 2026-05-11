import { useEffect, useState } from "react";
import { Search, Calendar, Trophy, Filter, ChevronUp, ChevronDown, Sparkles, FilterX, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "@/api/client";
import Loader from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ModernSelect } from "@/components/ui/ModernSelect";

interface RedeemedReward {
  _id: string;
  customerId: string;
  campaignTitle: string;
  pointsUsed: number;
  redeemedDate: string;
  expiryDate: string;
  status: "active" | "expired" | "used";
  customer?: {
    name: string;
    email?: string;
    phone: string;
  };
}

type SortField = "customerId" | "campaignTitle" | "pointsUsed" | "redeemedDate" | "status";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "active" | "expired" | "used";
type DateRangePreset = "all" | "7d" | "30d" | "90d";

export function AdminRedemptionsPage() {
  const [rewards, setRewards] = useState<RedeemedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [customerFilter, setCustomerFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRangePreset>("all");
  const [sortField, setSortField] = useState<SortField>("redeemedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      sortBy: sortField,
      sortOrder: sortDirection,
    });

    if (query.trim()) params.append("campaignTitle", query.trim());
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (customerFilter.trim()) params.append("customerId", customerFilter.trim());

    if (dateRange !== "all") {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      params.append("redeemedFrom", fromDate.toISOString());
    }

    apiFetch<{ rewards: RedeemedReward[]; total: number }>(`/admin/redemptions?${params}`)
      .then((data) => {
        if (!active) return;
        setRewards(data.rewards);
        setTotal(data.total);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load redemptions");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, statusFilter, customerFilter, dateRange, sortField, sortDirection, limit, offset]);

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
    setStatusFilter("all");
    setCustomerFilter("");
    setDateRange("all");
    setSortField("redeemedDate");
    setSortDirection("desc");
    setOffset(0);
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "used":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const activeCount = rewards.filter((item) => item.status === "active").length;
  const usedCount = rewards.filter((item) => item.status === "used").length;
  const expiredCount = rewards.filter((item) => item.status === "expired").length;
  const filtersApplied = [query.trim(), customerFilter.trim(), statusFilter !== "all", dateRange !== "all"].filter(Boolean).length;

  return (
    <div className="space-y-6 text-sm text-black">
      <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 shadow-[0_24px_80px_-45px_rgba(16,185,129,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Rewards Intelligence</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-black">Reward Redemptions</h2>
            <p className="mt-1 text-sm text-black">Monitor and track customer reward redemptions.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-xs text-black shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Total Redemptions: <span className="font-semibold text-black">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Active</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1 text-2xl font-display text-slate-900">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-sky-700">Used</p>
            <Clock3 className="h-4 w-4 text-sky-600" />
          </div>
          <p className="mt-1 text-2xl font-display text-slate-900">{usedCount}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-rose-700">Expired</p>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-1 text-2xl font-display text-slate-900">{expiredCount}</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-black">
            <Filter className="h-3.5 w-3.5" />
            Filter Controls
          </div>
          <div className="flex items-center gap-2">
            {filtersApplied > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {filtersApplied} filter{filtersApplied > 1 ? "s" : ""} active
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FilterX className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px] xl:grid-cols-[1fr_180px_180px_180px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by campaign title"
              className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-3 py-2.5 pl-10 pr-3 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
            />
          </label>

          <label className="relative block">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
            <input
              value={customerFilter}
              onChange={(event) => setCustomerFilter(event.target.value)}
              placeholder="Filter by customer ID"
              className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-3 py-2.5 pl-10 pr-3 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
            />
          </label>

          <ModernSelect
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="used">Used</option>
          </ModernSelect>

          <ModernSelect
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value as DateRangePreset)}
          >
            <option value="all">All Dates</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </ModernSelect>

          <div className="flex items-center gap-2 text-xs text-black">
            <Calendar className="h-4 w-4" />
            <span>Showing {rewards.length} of {total} redemptions</span>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} title="Unable to load redemptions" className="text-left" />
        ) : rewards.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-center">
            <Trophy className="mx-auto mb-2 h-6 w-6 text-black" />
            <p className="font-medium text-black">No redemptions found</p>
            <p className="text-black">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200">
              <table className="min-w-full bg-white text-left text-sm">
                <thead className="bg-slate-50/70 text-xs uppercase tracking-[0.12em] text-black">
                  <tr>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("customerId")}
                        className="flex items-center gap-1 hover:text-black"
                      >
                        Customer
                        {sortField === "customerId" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("campaignTitle")}
                        className="flex items-center gap-1 hover:text-black"
                      >
                        Campaign
                        {sortField === "campaignTitle" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleSort("pointsUsed")}
                        className="flex items-center gap-1 hover:text-black ml-auto"
                      >
                        Points Used
                        {sortField === "pointsUsed" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("redeemedDate")}
                        className="flex items-center gap-1 hover:text-black"
                      >
                        Redeemed Date
                        {sortField === "redeemedDate" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 hover:text-black"
                      >
                        Status
                        {sortField === "status" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rewards.map((reward) => (
                    <tr key={reward._id} className="border-t border-slate-100 transition hover:bg-emerald-50/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            {initials(reward.customer?.name || reward.customerId)}
                          </div>
                          <div>
                          <p className="font-semibold text-black">
                            {reward.customer?.name || "Unknown Customer"}
                          </p>
                          <p className="text-xs text-black">
                            {reward.customerId}
                          </p>
                          {reward.customer?.phone && (
                            <p className="text-xs text-black">
                              {reward.customer.phone}
                            </p>
                          )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-black">{reward.campaignTitle}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-black">
                        {reward.pointsUsed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-black">
                        {new Date(reward.redeemedDate).toLocaleDateString()}
                        <p className="text-xs text-black">Exp: {new Date(reward.expiryDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(reward.status)}`}>
                          {reward.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-black">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-black transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setOffset(offset + limit)}
                    disabled={offset + limit >= total}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-black transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function initials(value: string) {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return "NA";
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
}
