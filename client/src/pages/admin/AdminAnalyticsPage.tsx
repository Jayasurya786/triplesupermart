import { AnalyticsOverview } from "@/modules/admin/AnalyticsOverview";
import { getAdminAnalytics, type AdminAnalyticsResponse } from "@/services/adminService";
import Loader from "@/components/ui/Loader";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, BarChart3, CalendarRange, LineChart, Sparkles, Trophy, Users2 } from "lucide-react";
import { getUserFacingErrorMessage } from "@/utils/errors";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminAnalytics()
      .then((result) => {
        if (!mounted) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const maxRedemptions = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, ...data.trends.redemptionsByMonth.map((item) => item.count));
  }, [data]);

  const engagementPoints = useMemo(() => {
    if (!data || data.trends.engagementByMonth.length === 0) return "";
    const width = 100;
    const height = 40;
    const max = Math.max(1, ...data.trends.engagementByMonth.map((item) => item.pct));
    return data.trends.engagementByMonth
      .map((point, index, arr) => {
        const x = arr.length === 1 ? width / 2 : (index / (arr.length - 1)) * width;
        const y = height - (point.pct / max) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data]);

  const engagementPeak = useMemo(() => {
    if (!data || data.trends.engagementByMonth.length === 0) return 0;
    return Math.max(...data.trends.engagementByMonth.map((item) => item.pct));
  }, [data]);

  const latestMembers = data?.trends.membersByMonth.at(-1)?.count ?? 0;
  const previousMembers = data?.trends.membersByMonth.at(-2)?.count ?? 0;
  const memberDelta = latestMembers - previousMembers;

  if (loading) {
    return <Loader />;
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <ErrorMessage error={error} title="Unable to load analytics data" />
        <div className="rounded-[1.25rem] border border-rose-200 bg-white/80 p-4 text-rose-800">
          <p className="font-semibold text-rose-900">What to do next</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>Refresh the page and try again.</li>
            <li>If you were signed out, log in again.</li>
            <li>If the problem continues, check your connection or contact support.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5 shadow-[0_24px_80px_-45px_rgba(16,185,129,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Performance Intelligence</p>
            <h2 className="mt-1 text-2xl font-display text-slate-900">Analytics Command View</h2>
            <p className="mt-2 max-w-2xl text-sm text-black">
              Monitor member growth, reward behavior, and campaign traction across recent months.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
            <CalendarRange className="h-4 w-4" />
            Rolling {data.trends.redemptionsByMonth.length}-month window
          </div>
        </div>
      </div>

      <AnalyticsOverview
        activeMembers={data.summary.activeMembers}
        monthlyRedemptions={data.summary.monthlyRedemptions}
        offerEngagementPct={data.summary.offerEngagementPct}
        activeOffers={data.summary.activeOffers}
        totalCampaigns={data.summary.totalCampaigns}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.4rem] border border-emerald-100 bg-white/90 p-4 shadow-[0_18px_55px_-38px_rgba(16,185,129,0.45)]">
          <p className="text-xs uppercase tracking-[0.16em] text-black">Engagement Peak</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{engagementPeak.toFixed(1)}%</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> Highest monthly conversion
          </div>
        </div>
        <div className="rounded-[1.4rem] border border-cyan-100 bg-white/90 p-4 shadow-[0_18px_55px_-38px_rgba(6,182,212,0.35)]">
          <p className="text-xs uppercase tracking-[0.16em] text-black">Member Momentum</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{memberDelta >= 0 ? "+" : ""}{memberDelta}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700">
            <Users2 className="h-3.5 w-3.5" /> vs previous month
          </div>
        </div>
        <div className="rounded-[1.4rem] border border-violet-100 bg-white/90 p-4 shadow-[0_18px_55px_-38px_rgba(139,92,246,0.35)]">
          <p className="text-xs uppercase tracking-[0.16em] text-black">Campaign Effectiveness</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{data.campaignPerformance.length}</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
            <ArrowUpRight className="h-3.5 w-3.5" /> campaigns with activity
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.12)] xl:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-black">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Monthly Redemptions</h3>
          </div>
          <div className="grid grid-cols-6 gap-3 pt-2">
            {data.trends.redemptionsByMonth.map((item) => {
              const height = Math.max(6, (item.count / maxRedemptions) * 170);
              const isPeak = item.count === maxRedemptions;
              return (
                <div key={item.month} className="flex flex-col items-center justify-end gap-2">
                  <span className={`text-xs font-medium ${isPeak ? "text-emerald-700" : "text-black"}`}>{item.count}</span>
                  <div
                    className={`w-full rounded-t-[1.5rem] transition-all duration-500 ${
                      isPeak
                        ? "bg-gradient-to-t from-emerald-700 via-emerald-500 to-emerald-300 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.65)]"
                        : "bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-300"
                    }`}
                    style={{ height }}
                  />
                  <span className="text-xs text-black">{item.month}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.12)]">
          <div className="mb-4 flex items-center gap-2 text-black">
            <LineChart className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Engagement Trend</h3>
          </div>
          <div className="rounded-[1.5rem] bg-emerald-50/80 p-4 shadow-inner shadow-slate-100">
            <svg viewBox="0 0 100 48" className="h-36 w-full overflow-visible">
              <defs>
                <linearGradient id="engagement-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={engagementPoints}
              />
              <polygon fill="url(#engagement-gradient)" points={`${engagementPoints} 100,48 0,48`} />
              {data.trends.engagementByMonth.map((item, index, arr) => {
                const max = Math.max(1, ...arr.map((entry) => entry.pct));
                const x = arr.length === 1 ? 50 : (index / (arr.length - 1)) * 100;
                const y = 40 - (item.pct / max) * (40 - 4) - 2;
                return <circle key={item.month} cx={x} cy={y} r="1.4" fill="#059669" />;
              })}
            </svg>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[11px] text-black">
              <div>
                <p className="font-semibold">{data.trends.engagementByMonth.at(-1)?.pct.toFixed(1) ?? "0.0"}%</p>
                <p>Current</p>
              </div>
              <div>
                <p className="font-semibold">
                  {Math.max(...data.trends.engagementByMonth.map((item) => item.pct), 0).toFixed(1)}%
                </p>
                <p>Peak</p>
              </div>
              <div>
                <p className="font-semibold">{data.trends.engagementByMonth.length} mo</p>
                <p>Window</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.12)]">
          <div className="mb-4 flex items-center gap-2 text-black">
            <Activity className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Member Growth</h3>
          </div>
          <div className="space-y-3">
            {data.trends.membersByMonth.map((item, index, arr) => {
              const prev = index > 0 ? arr[index - 1].count : item.count;
              const delta = item.count - prev;
              return (
                <div key={item.month} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <span className="text-sm text-black">{item.month}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{new Intl.NumberFormat("en-US").format(item.count)}</p>
                    <p className={`text-[11px] ${delta >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      {delta >= 0 ? "+" : ""}{delta} vs prev
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.12)]">
          <div className="mb-4 flex items-center gap-2 text-black">
            <Trophy className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Top Campaign Performance</h3>
          </div>
          <div className="space-y-3">
            {data.campaignPerformance.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700">
                No reward redemptions recorded yet.
              </div>
            ) : (
              data.campaignPerformance.map((item, index) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                        {index + 1}
                      </span>
                      {item.title}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black">{item.redemptions} redemptions</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                      style={{ width: `${Math.max(8, (item.redemptions / Math.max(...data.campaignPerformance.map((campaign) => campaign.redemptions), 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

