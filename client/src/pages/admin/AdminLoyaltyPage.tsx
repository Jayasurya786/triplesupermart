import { useEffect, useMemo, useState } from "react";
import { Plus, X, Trash, Sparkles, ShieldCheck, Save, Gift, Diamond, Star, TrendingUp, Clock3, BadgeCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import Loader from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ModernSelect } from "@/components/ui/ModernSelect";
import {
  getLoyaltyConfig,
  listRewardCampaigns,
  updateLoyaltyConfig,
  createRewardCampaign,
  updateRewardCampaign,
  deleteRewardCampaign,
  type RewardCampaignRecord,
} from "@/services/loyaltyService";

const badgeOptions = [
  { value: "hot", label: "Hot" },
  { value: "new", label: "New" },
  { value: "limited", label: "Limited" },
] as const;

const iconOptions = ["🎁", "💎", "🌟"] as const;

const bgColorOptions = [
  { value: "from-blue-100 to-blue-200", label: "Blue Glow" },
  { value: "from-pink-100 via-purple-100 to-indigo-100", label: "Sunrise" },
  { value: "from-emerald-100 via-lime-100 to-teal-100", label: "Fresh Green" },
] as const;

const getIconComponent = (icon: string) => {
  switch (icon) {
    case "🎁":
      return <Gift className="h-8 w-8 text-emerald-600" />;
    case "💎":
      return <Diamond className="h-8 w-8 text-emerald-600" />;
    case "🌟":
      return <Star className="h-8 w-8 text-emerald-600" />;
    default:
      return <Gift className="h-8 w-8 text-emerald-600" />;
  }
};

export function AdminLoyaltyPage() {
  const [configForm, setConfigForm] = useState({
    pointsPerDollar: 1,
    redemptionStep: 100,
    welcomeBonus: 200,
    birthdayBonus: 500,
  });
  const [campaigns, setCampaigns] = useState<RewardCampaignRecord[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const [campaignForm, setCampaignForm] = useState({
    title: "",
    description: "",
    pointsRequired: 500,
    discount: 0,
    expiryDate: "",
    badge: "new" as "hot" | "new" | "limited",
    icon: "🎁",
    bgColor: "from-blue-100 to-blue-200",
    active: true,
  });

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [configResponse, campaignResponse] = await Promise.all([
          getLoyaltyConfig(),
          listRewardCampaigns(),
        ]);

        if (!active) return;
        setConfigForm({
          pointsPerDollar: configResponse.config.pointsPerDollar,
          redemptionStep: configResponse.config.redemptionStep,
          welcomeBonus: configResponse.config.welcomeBonus,
          birthdayBonus: configResponse.config.birthdayBonus,
        });
        setCampaigns(campaignResponse.campaigns);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load loyalty settings");
      } finally {
        setLoading(false);
      }
      if (!active) return;
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const campaignStats = useMemo(() => {
    const active = campaigns.filter((campaign) => campaign.active).length;
    const upcoming = campaigns.filter((campaign) => new Date(campaign.expiryDate) > new Date()).length;
    const avgPoints = campaigns.length
      ? Math.round(campaigns.reduce((sum, campaign) => sum + campaign.pointsRequired, 0) / campaigns.length)
      : 0;
    return {
      total: campaigns.length,
      active,
      upcoming,
      avgPoints,
    };
  }, [campaigns]);

  const handleConfigSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingConfig(true);
    setError(null);

    try {
      await updateLoyaltyConfig({
        pointsPerDollar: configForm.pointsPerDollar,
        redemptionStep: configForm.redemptionStep,
        welcomeBonus: configForm.welcomeBonus,
        birthdayBonus: configForm.birthdayBonus,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save loyalty settings");
    } finally {
      setSavingConfig(false);
    }
  };

  const handleCreateCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatingCampaign(true);
    setCampaignError(null);

    try {
      const response = await createRewardCampaign({
        title: campaignForm.title.trim(),
        description: campaignForm.description.trim(),
        pointsRequired: Number(campaignForm.pointsRequired),
        discount: Number(campaignForm.discount),
        expiryDate: campaignForm.expiryDate,
        badge: campaignForm.badge,
        icon: campaignForm.icon,
        bgColor: campaignForm.bgColor,
        active: campaignForm.active,
      });
      setCampaigns((prev) => [response.campaign, ...prev]);
      setShowCreate(false);
      setCampaignForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        pointsRequired: 500,
        discount: 0,
        expiryDate: "",
      }));
    } catch (err) {
      setCampaignError(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleToggleCampaignState = async (campaign: RewardCampaignRecord) => {
    try {
      const response = await updateRewardCampaign(campaign._id, { active: !campaign.active });
      setCampaigns((prev) => prev.map((item) => (item._id === response.campaign._id ? response.campaign : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeactivateCampaign = async (id: string) => {
    try {
      await deleteRewardCampaign(id);
      setCampaigns((prev) => prev.filter((campaign) => campaign._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-sm text-black">
      <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-4 sm:p-6 shadow-[0_24px_80px_-45px_rgba(16,185,129,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Loyalty Command</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-black">Loyalty Rules & Rewards</h2>
            <p className="mt-1 text-sm text-black">Manage points conversion, membership bonuses, and customer reward campaigns.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-xs text-black shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Total campaigns: <span className="font-semibold text-black">{campaignStats.total}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-700">Points / Dollar</p>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="mt-1 text-xl font-display text-slate-900">{configForm.pointsPerDollar}</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-sky-700">Welcome Bonus</p>
              <BadgeCheck className="h-3.5 w-3.5 text-sky-600" />
            </div>
            <p className="mt-1 text-xl font-display text-slate-900">{configForm.welcomeBonus.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-700">Birthday Bonus</p>
              <Gift className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="mt-1 text-xl font-display text-slate-900">{configForm.birthdayBonus.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {error && (
        <ErrorMessage error={error} title="Unable to load loyalty settings" />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 sm:p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
          <div className="mb-4 flex items-center gap-3 text-black">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-lg font-semibold text-black">Points & Bonus Configuration</h3>
              <p className="text-sm text-black">Set the core loyalty conversion rules and sign-up rewards.</p>
            </div>
          </div>

          <form onSubmit={handleConfigSave} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Points per Dollar</span>
              <input
                type="number"
                min={1}
                value={configForm.pointsPerDollar}
                onChange={(event) => setConfigForm((prev) => ({ ...prev, pointsPerDollar: Number(event.target.value) }))}
                className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Points per Redemption</span>
              <input
                type="number"
                min={1}
                value={configForm.redemptionStep}
                onChange={(event) => setConfigForm((prev) => ({ ...prev, redemptionStep: Number(event.target.value) }))}
                className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Welcome Bonus</span>
                <input
                  type="number"
                  min={0}
                  value={configForm.welcomeBonus}
                  onChange={(event) => setConfigForm((prev) => ({ ...prev, welcomeBonus: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Birthday Bonus</span>
                <input
                  type="number"
                  min={0}
                  value={configForm.birthdayBonus}
                  onChange={(event) => setConfigForm((prev) => ({ ...prev, birthdayBonus: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-black">Current values are applied instantly to campaign calculations.</p>
                <p className="text-xs text-black">Updated config will be used across the portal experience.</p>
              </div>
              <button
                type="submit"
                disabled={savingConfig}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {savingConfig ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <GlassCard>
              <p className="text-xs uppercase tracking-[0.16em] text-black">Active Campaigns</p>
              <p className="mt-2 text-3xl font-semibold text-black">{campaignStats.active}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-xs uppercase tracking-[0.16em] text-black">Upcoming Expiry</p>
              <p className="mt-2 text-3xl font-semibold text-black">{campaignStats.upcoming}</p>
            </GlassCard>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 sm:p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
          <div className="mb-4 flex items-center gap-3 text-black">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-lg font-semibold text-black">Tier & Reward Preview</h3>
              <p className="text-sm text-black">Preview the loyalty structure your customers see in the portal.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-black">Fresh</p>
              <p className="text-xs text-black">Entry tier with welcome rewards.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-black">Prime</p>
              <p className="text-xs text-black">Earn bonus points faster and access premium offers.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-black">Emerald</p>
              <p className="text-xs text-black">Highest tier with exclusive rewards and faster redemption.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 sm:p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">Reward Campaigns</h3>
            <p className="text-sm text-black">Add and manage loyalty reward campaigns for customers.</p>
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black">
              Avg points required: <span className="font-semibold text-black">{campaignStats.avgPoints.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : campaigns.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50/80 p-8 text-center text-emerald-700">
            <p className="font-semibold text-black">No reward campaigns configured</p>
            <p className="mt-2 text-sm">Create a new campaign to make loyalty rewards available in the portal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-14 w-14 place-items-center rounded-2xl border border-white/60 bg-gradient-to-br ${campaign.bgColor}`}>
                      {getIconComponent(campaign.icon)}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-black">{campaign.title}</p>
                      <p className="text-sm text-black">{campaign.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full md:w-auto">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${campaign.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {campaign.active ? "Active" : "Inactive"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleCampaignState(campaign)}
                      className="w-full sm:w-auto rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {campaign.active ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeactivateCampaign(campaign._id)}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-slate-50 p-3 text-sm text-slate-700">
                    <span className="block font-semibold text-black">Points Required</span>
                    {campaign.pointsRequired.toLocaleString()}
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-3 text-sm text-slate-700">
                    <span className="block font-semibold text-black">Discount</span>
                    ${campaign.discount.toFixed(0)}
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-3 text-sm text-slate-700">
                    <span className="block font-semibold text-black">Expires</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-black" />
                      {formatDate(campaign.expiryDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/30 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-emerald-200 bg-white p-4 sm:p-6 shadow-2xl my-4 sm:my-0">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-black">Create Reward Campaign</h3>
                <p className="text-sm text-black">Launch a new reward campaign for loyalty members.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-full p-2 text-slate-700 transition hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Campaign Title</span>
                  <input
                    required
                    value={campaignForm.title}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Expiry Date</span>
                  <input
                    required
                    type="date"
                    value={campaignForm.expiryDate}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, expiryDate: event.target.value }))}
                    className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Campaign Description</span>
                <textarea
                  required
                  rows={3}
                  value={campaignForm.description}
                  onChange={(event) => setCampaignForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                />
              </label>

              <div className="grid gap-4 lg:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Points Required</span>
                  <input
                    required
                    type="number"
                    min={0}
                    value={campaignForm.pointsRequired}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, pointsRequired: Number(event.target.value) }))}
                    className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Instant Discount</span>
                  <input
                    type="number"
                    min={0}
                    value={campaignForm.discount}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, discount: Number(event.target.value) }))}
                    className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Status</span>
                  <ModernSelect
                    value={campaignForm.active ? "active" : "inactive"}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, active: event.target.value === "active" }))}
                    className="mt-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </ModernSelect>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Badge</span>
                  <ModernSelect
                    value={campaignForm.badge}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, badge: event.target.value as "hot" | "new" | "limited" }))}
                    className="mt-2"
                  >
                    {badgeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </ModernSelect>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Icon</span>
                  <ModernSelect
                    value={campaignForm.icon}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, icon: event.target.value }))}
                    className="mt-2"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </ModernSelect>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Color Style</span>
                  <ModernSelect
                    value={campaignForm.bgColor}
                    onChange={(event) => setCampaignForm((prev) => ({ ...prev, bgColor: event.target.value }))}
                    className="mt-2"
                  >
                    {bgColorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </ModernSelect>
                </label>
              </div>

              {campaignError && (
                <ErrorMessage
                  error={campaignError}
                  title="Unable to save campaign"
                  compact
                  hideTitle
                  className="w-full"
                />
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-black transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCampaign}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {creatingCampaign ? "Creating..." : "Publish Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

