import { useMemo } from "react";
import styled from "styled-components";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard, Sparkles, Gift, TrendingUp, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function PortalCardPage() {
  const { user } = useAuth();

  const tierBadge = useMemo(() => {
    if (user?.role === "admin" || user?.role === "staff") return "Admin";
    return "Fresh";
  }, [user?.role]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Membership</p>
        <h2 className="text-2xl sm:text-3xl font-display text-brand-900">Your Digital Card</h2>
        <p className="max-w-2xl text-sm text-slate-600">Display this card at checkout for instant rewards collection and member perks.</p>
      </div>

      <div className="flex w-full justify-center py-8">
        <StyledWrapper>
          <div className="flip-card">
            <div className="flip-card-inner">
              {/* Decorative background elements */}
              <div className="card-glow"></div>
              
              {/* Front of card */}
              <div className="flip-card-front">
                <div className="card-decoration card-decoration-1"></div>
                <div className="card-decoration card-decoration-2"></div>
                
                <div className="card-top">
                  <div className="flex flex-col">
                    <p className="heading_card">{tierBadge}</p>
                    <p className="heading_subtitle">Member Card</p>
                  </div>
                  <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={48} height={48}>
                    <circle cx="24" cy="24" r="22" fill="#ffffff" opacity="0.2" />
                    <path fill="#ffffff" d="M24 6c-9.94 0-18 8.06-18 18s8.06 18 18 18 18-8.06 18-18-8.06-18-18-18zm8 20h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z" opacity="0.95" />
                  </svg>
                </div>

                <div className="card-middle">
                  <div className="chip-container">
                    <svg version="1.1" className="chip" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="40px" height="40px">
                      <rect x="6" y="6" width="38" height="38" rx="3" fill="#ffffff" opacity="0.4" />
                      <rect x="12" y="12" width="8" height="8" fill="#ffffff" opacity="0.8" />
                      <rect x="30" y="12" width="8" height="8" fill="#ffffff" opacity="0.8" />
                      <rect x="12" y="30" width="8" height="8" fill="#ffffff" opacity="0.8" />
                      <rect x="30" y="30" width="8" height="8" fill="#ffffff" opacity="0.8" />
                    </svg>
                  </div>
                </div>

                <div className="card-bottom">
                  <p className="name">{user?.name ?? "MEMBER NAME"}</p>
                  <p className="member-id">{user?.customerId ?? "TNS0000"}</p>
                </div>
              </div>

              {/* Back of card */}
              <div className="flip-card-back">
                <div className="card-decoration card-decoration-3"></div>
                <div className="strip" />
                <div className="back-content">
                  <div className="back-section">
                    <p className="back-label">Tier Status</p>
                    <p className="back-value">{tierBadge}</p>
                  </div>
                  <div className="back-divider"></div>
                  <div className="back-section">
                    <p className="back-label">Member Since</p>
                    <p className="back-value">May 2026</p>
                  </div>
                  <div className="back-bottom">
                    <p className="back-small">For rewards & benefits, visit your portal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StyledWrapper>
      </div>

      {/* Card Info Grid */}
      <div className="grid gap-5 md:grid-cols-3">
        <GlassCard>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 p-4 w-fit">
              <CreditCard className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Digital Card</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">Show anywhere</p>
              <p className="mt-1 text-xs text-slate-600">Use this card at checkout or online to collect points instantly.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-4 w-fit">
              <TrendingUp className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Earn Points</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">Automatically</p>
              <p className="mt-1 text-xs text-slate-600">Points are added with every qualifying purchase.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 p-4 w-fit">
              <Gift className="h-6 w-6 text-fuchsia-700" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Redeem Rewards</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">Exclusive Perks</p>
              <p className="mt-1 text-xs text-slate-600">Turn points into vouchers, discounts, and limited offers.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Benefits Section */}
      <GlassCard>
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-600">Member Tier Benefits</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{tierBadge} Member Perks</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 p-3">
                <Sparkles className="h-6 w-6 text-brand-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Exclusive Discounts</p>
                <p className="text-sm text-slate-600 mt-1">Early access to member-only promotions and seasonal offers.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Bonus Points</p>
                <p className="text-sm text-slate-600 mt-1">Earn extra points during promotional periods and birthday month.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-3">
                <Gift className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Special Rewards</p>
                <p className="text-sm text-slate-600 mt-1">Access tier-specific reward campaigns and limited editions.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 p-3">
                <ArrowRight className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Priority Support</p>
                <p className="text-sm text-slate-600 mt-1">Get dedicated customer service and priority assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* How to Use */}
      <GlassCard>
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-600">How to Use Your Card</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">Quick Start Guide</h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-emerald-500 text-white font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-slate-900">Show Your Card</p>
                <p className="text-sm text-slate-600 mt-1">Display this digital card at checkout to activate member benefits.</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 text-white font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-slate-900">Earn Points</p>
                <p className="text-sm text-slate-600 mt-1">Points are automatically added to your account for each purchase.</p>
              </div>
            </div>

            <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-fuchsia-400 text-white font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-slate-900">Redeem Rewards</p>
                <p className="text-sm text-slate-600 mt-1">Visit the Rewards section to browse and redeem your points.</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

const StyledWrapper = styled.div`
  .flip-card {
    background-color: transparent;
    width: min(520px, 92vw);
    aspect-ratio: 13 / 8;
    height: auto;
    perspective: 1200px;
    color: white;
    position: relative;
  }

  .card-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 1.75rem;
    background: radial-gradient(ellipse at 50% 30%, rgba(52, 211, 153, 0.3) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .card-decoration {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
  }

  .card-decoration-1 {
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.2);
    top: -60px;
    right: -80px;
  }

  .card-decoration-2 {
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.15);
    bottom: -40px;
    left: -50px;
  }

  .card-decoration-3 {
    width: 180px;
    height: 180px;
    background: rgba(255, 255, 255, 0.15);
    bottom: -50px;
    right: -60px;
  }

  .card-top {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 10;
  }

  .heading_card {
    font-size: 1.1em;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #ffffff;
    text-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }

  .heading_subtitle {
    font-size: 0.7em;
    font-weight: 500;
    letter-spacing: 1.5px;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    margin-top: 0.25rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  .logo {
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s ease;
  }

  .flip-card:hover .logo {
    transform: scale(1.05);
  }

  .chip-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    box-shadow: inset 0 2px 8px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .card-middle {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    z-index: 10;
  }

  .chip {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .card-bottom {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    z-index: 10;
  }

  .name {
    font-weight: 700;
    font-size: 1.15em;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .member-id {
    font-weight: 600;
    font-size: 0.9em;
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 2px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  .back-content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 2rem;
    gap: 0.5rem;
    z-index: 10;
  }

  .back-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  .back-divider {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    border-radius: 1px;
  }

  .back-label {
    font-weight: 600;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .back-value {
    font-weight: 700;
    font-size: 1.15em;
    color: #ffffff;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .back-bottom {
    position: absolute;
    bottom: 1.5rem;
    left: 0;
    right: 0;
    text-align: center;
  }

  .back-small {
    font-weight: 500;
    font-size: 0.75em;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .strip {
    position: absolute;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.08) 100%);
    width: 100%;
    height: 3rem;
    top: 0;
    border-radius: 1.75rem 1.75rem 0 0;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1.75rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .flip-card-front {
    background: linear-gradient(135deg, #065f46 0%, #059669 25%, #10b981 60%, #34d399 100%);
    box-shadow: 0 30px 80px -20px rgba(5, 150, 105, 0.5), 
                0 15px 40px -15px rgba(5, 150, 105, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .flip-card-back {
    background: linear-gradient(135deg, #064e3b 0%, #047857 30%, #059669 70%, #10b981 100%);
    transform: rotateY(180deg);
    box-shadow: 0 30px 80px -20px rgba(4, 120, 87, 0.5),
                0 15px 40px -15px rgba(4, 120, 87, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    .flip-card {
      width: min(360px, 92vw);
    }

    .card-top,
    .card-bottom {
      padding: 1.5rem;
    }

    .heading_card {
      font-size: 0.95em;
    }

    .heading_subtitle {
      font-size: 0.6em;
    }

    .logo {
      width: 40px;
      height: 40px;
    }

    .chip-container {
      width: 60px;
      height: 60px;
    }

    .chip {
      width: 32px;
      height: 32px;
    }

    .name {
      font-size: 0.95em;
    }

    .member-id {
      font-size: 0.8em;
      letter-spacing: 1.25px;
    }

    .back-content {
      padding: 2rem 1.5rem;
    }

    .back-value {
      font-size: 0.95em;
    }

    .card-decoration-1 {
      width: 140px;
      height: 140px;
      top: -40px;
      right: -60px;
    }

    .card-decoration-2 {
      width: 100px;
      height: 100px;
      bottom: -30px;
      left: -40px;
    }

    .card-decoration-3 {
      width: 120px;
      height: 120px;
      bottom: -40px;
      right: -50px;
    }
  }

  @media (max-width: 420px) {
    .card-top,
    .card-bottom {
      padding: 1.1rem;
    }

    .heading_card {
      font-size: 0.85em;
    }

    .name {
      font-size: 0.85em;
      letter-spacing: 1px;
    }

    .member-id {
      font-size: 0.72em;
      letter-spacing: 1px;
    }

    .back-content {
      padding: 1.4rem 1rem;
    }

    .back-label {
      font-size: 0.68em;
    }

    .back-value {
      font-size: 0.86em;
    }
  }
`;


