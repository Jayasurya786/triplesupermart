import { useEffect, useMemo, useState } from "react";
import { Search, Award, Check, Percent, Trophy, Gift, Sparkles, Wallet, ArrowRightLeft } from "lucide-react";
import { getCustomer, listCustomers, type CustomerRecord } from "@/services/customerService";
import Loader from "@/components/ui/Loader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { getLoyaltyConfig, adjustPoints, type LoyaltyConfig, listRewardCampaigns, redeemReward, type RewardCampaignRecord as RewardCampaign } from "@/services/loyaltyService";

export function AdminRedeemPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [config, setConfig] = useState<LoyaltyConfig | null>(null);
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [manualPoints, setManualPoints] = useState<number | "">("");
  const [selectedCampaign, setSelectedCampaign] = useState<RewardCampaign | null>(null);
  const [activeTab, setActiveTab] = useState<"award" | "redeem">("award");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [customerResponse, configResponse, campaignsResponse] = await Promise.all([
          listCustomers(),
          getLoyaltyConfig(),
          listRewardCampaigns(),
        ]);

        if (!active) {
          return;
        }
        setCustomers(customerResponse.customers);
        setConfig(configResponse.config);
        setCampaigns(campaignsResponse.campaigns);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : "Unable to load customers or loyalty settings");
      } finally {
        setLoading(false);
      }
      if (!active) {
        return;
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const matches = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return customers.filter((customer) =>
      customer.customerId.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.name.toLowerCase().includes(query)
    );
  }, [customers, searchTerm]);

  const calculatedPoints = useMemo(() => {
    if (purchaseAmount <= 0) return 0;
    return Math.max(0, Math.floor((config?.pointsPerDollar ?? 1) * purchaseAmount));
  }, [purchaseAmount, config]);

  const chosenPoints = typeof manualPoints === "number" && manualPoints >= 0 ? manualPoints : calculatedPoints;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!selectedCustomer) {
      setError("Please select a customer by ID or phone number.");
      setSaving(false);
      return;
    }

    const pointsToAdd = Number(chosenPoints);
    if (Number.isNaN(pointsToAdd) || pointsToAdd <= 0) {
      setError("Enter a valid points amount to award.");
      setSaving(false);
      return;
    }

    try {
      const response = await adjustPoints(selectedCustomer.customerId, pointsToAdd);
      setSelectedCustomer((prev) =>
        prev ? { ...prev, points: response.result.points } : prev
      );
      setSuccess(`Added ${pointsToAdd} points to ${selectedCustomer.name}.`);
      setPurchaseAmount(0);
      setManualPoints("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to award points");
    } finally {
      setSaving(false);
    }
  };

  const handleRedeemReward = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!selectedCustomer) {
      setError("Please select a customer by ID or phone number.");
      setSaving(false);
      return;
    }

    if (!selectedCampaign) {
      setError("Please select a reward campaign.");
      setSaving(false);
      return;
    }

    try {
      const freshCustomerResponse = await getCustomer(selectedCustomer.customerId);
      const freshCustomer = freshCustomerResponse.customer;

      if (freshCustomer.points < selectedCampaign.pointsRequired) {
        setSelectedCustomer(freshCustomer);
        setError(
          `This customer has ${freshCustomer.points.toLocaleString()} points, but ${selectedCampaign.pointsRequired.toLocaleString()} are required.`
        );
        setSaving(false);
        return;
      }

      const response = await redeemReward(freshCustomer.customerId, selectedCampaign._id);
      setSelectedCustomer((prev) =>
        prev ? { ...prev, points: response.result.remainingPoints } : prev
      );
      setSuccess(`Redeemed "${selectedCampaign.title}" for ${selectedCustomer.name}.`);
      setSelectedCampaign(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to redeem reward");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-sm text-black">
      <div className="rounded-[1.9rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 shadow-[0_24px_80px_-45px_rgba(16,185,129,0.45)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Loyalty Operations</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-black">Points Award & Redeem</h2>
            <p className="mt-1 text-sm text-black">Award loyalty points for purchases or redeem rewards using customer ID or phone.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-xs text-black shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Points per dollar: <span className="font-semibold text-black">{config?.pointsPerDollar ?? 1}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Customers</p>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1 text-2xl font-display text-slate-900">{customers.length}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-sky-700">Active Campaigns</p>
            <Gift className="h-4 w-4 text-sky-600" />
          </div>
          <p className="mt-1 text-2xl font-display text-slate-900">{campaigns.filter((c) => c.active).length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-amber-700">Current Mode</p>
            <ArrowRightLeft className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-1 text-2xl font-display text-slate-900">{activeTab === "award" ? "Award" : "Redeem"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-[1.5rem] border border-slate-200 bg-white/90 p-1 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.1)]">
        <button
          onClick={() => setActiveTab("award")}
          className={`flex-1 rounded-[1.25rem] px-4 py-2 text-sm font-semibold transition ${
            activeTab === "award"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-black hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Award className="h-4 w-4" />
            Award Points
          </div>
        </button>
        <button
          onClick={() => setActiveTab("redeem")}
          className={`flex-1 rounded-[1.25rem] px-4 py-2 text-sm font-semibold transition ${
            activeTab === "redeem"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-black hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-4 w-4" />
            Redeem Rewards
          </div>
        </button>
      </div>

      {error && (
        <ErrorMessage error={error} title="Unable to load redemption data" className="mb-4" />
      )}
      {success && <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 sm:p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
          <div className="mb-5 flex items-center gap-3 text-black">
            <Search className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-lg font-semibold text-black">Find Customer</h3>
              <p className="text-sm text-black">Search by customer ID, phone number, or name.</p>
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Customer ID / Phone</span>
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setSelectedCustomer(null);
                setSelectedCampaign(null);
              }}
              placeholder="e.g. CUST-0001 or +123456789"
              className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
            />
          </label>

          <div className="mt-5 space-y-3">
            {loading ? (
              <Loader />
            ) : matches.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-black">Start typing to select a customer.</div>
            ) : (
              matches.slice(0, 6).map((customer) => (
                <button
                  key={customer._id}
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setSearchTerm(customer.customerId);
                  }}
                  className={`w-full rounded-[1.5rem] border px-4 py-3 text-left transition ${
                    selectedCustomer?._id === customer._id
                      ? "border-emerald-500 bg-emerald-50 shadow-[0_10px_30px_-22px_rgba(16,185,129,0.55)]"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-black">{customer.name}</p>
                      <p className="text-xs text-black">{customer.customerId} • {customer.phone}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black">{customer.tier}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {activeTab === "award" ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 sm:p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
            <div className="mb-5 flex items-center gap-3 text-black">
              <Percent className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold text-black">Award Points</h3>
                <p className="text-sm text-black">Enter the purchase amount and submit to award points.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-black">Selected Customer</p>
                  {selectedCustomer ? (
                    <div className="mt-3 space-y-1">
                      <p className="text-base font-semibold text-black">{selectedCustomer.name}</p>
                      <p className="text-sm text-black">{selectedCustomer.customerId}</p>
                      <p className="text-sm text-black">Points: {selectedCustomer.points.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-black">No customer selected yet.</p>
                  )}
                </div>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Purchase Amount</span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={purchaseAmount}
                    onChange={(event) => setPurchaseAmount(Number(event.target.value))}
                    placeholder="Enter purchase amount"
                    className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Points to Award</span>
                  <input
                    type="number"
                    min={0}
                    value={manualPoints}
                    onChange={(event) => setManualPoints(event.target.value === "" ? "" : Number(event.target.value))}
                    placeholder={calculatedPoints > 0 ? `${calculatedPoints} points based on purchase` : "Auto-calculated from purchase"}
                    className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-white px-3 py-2.5 text-sm text-black outline-none ring-emerald-200 transition focus:border-emerald-500 focus:ring-2"
                  />
                  <p className="mt-2 text-xs text-black">Leave blank to award {calculatedPoints} points based on current rate.</p>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-black">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Use current points-per-dollar rate</span>
                  </div>
                  <p className="mt-2 text-xs text-black">You can override points manually if needed.</p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>Apply Points</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 sm:p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.1)]">
            <div className="mb-5 flex items-center gap-3 text-black">
              <Gift className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold text-black">Redeem Rewards</h3>
                <p className="text-sm text-black">Select a reward campaign to redeem for the customer.</p>
              </div>
            </div>

            <form onSubmit={handleRedeemReward} className="space-y-5">
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-black">Selected Customer</p>
                  {selectedCustomer ? (
                    <div className="mt-3 space-y-1">
                      <p className="text-base font-semibold text-black">{selectedCustomer.name}</p>
                      <p className="text-sm text-black">{selectedCustomer.customerId}</p>
                      <p className="text-sm text-black">Points: {selectedCustomer.points.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-black">No customer selected yet.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black">Available Rewards</p>
                  {loading ? (
                    <Loader />
                  ) : campaigns.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-black">No active reward campaigns available.</div>
                  ) : (
                    campaigns.filter(campaign => campaign.active).map((campaign) => (
                      <button
                        key={campaign._id}
                        type="button"
                        onClick={() => setSelectedCampaign(campaign)}
                        disabled={selectedCustomer ? selectedCustomer.points < campaign.pointsRequired : true}
                        className={`w-full rounded-[1.5rem] border px-4 py-3 text-left transition ${
                          selectedCampaign?._id === campaign._id
                            ? "border-emerald-500 bg-emerald-50 shadow-[0_10px_30px_-22px_rgba(16,185,129,0.55)]"
                            : selectedCustomer && selectedCustomer.points >= campaign.pointsRequired
                            ? "border-slate-200 bg-white hover:bg-slate-50"
                            : "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-black">{campaign.title}</p>
                            <p className="text-xs text-black">{campaign.pointsRequired.toLocaleString()} points required</p>
                          </div>
                          <div className="text-right">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black">
                              {campaign.pointsRequired} pts
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-black">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-emerald-600" />
                    <span>Redeem selected reward</span>
                  </div>
                  <p className="mt-2 text-xs text-black">Points will be deducted from customer balance.</p>
                </div>
                <button
                  type="submit"
                  disabled={saving || !selectedCustomer || !selectedCampaign}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>Redeem Reward</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

