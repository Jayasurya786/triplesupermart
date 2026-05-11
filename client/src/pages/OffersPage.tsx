import { PageHeader } from "@/components/ui/PageHeader";
import OfferCard from "@/components/common/OfferCard";
import { Seo } from "@/seo/Seo";
import { Trophy, ShoppingBag, Gift, type LucideIcon } from "lucide-react";
import { listOffers, type OfferRecord } from "@/services/offerService";
import Loader from "@/components/ui/Loader";
import { useEffect, useMemo, useState } from "react";

interface OfferItem {
  title: string;
  detail: string;
  icon: LucideIcon;
}

const fallbackOffers: OfferItem[] = [
  { title: "Member Monday", detail: "Earn 2x points on fresh produce.", icon: Trophy },
  { title: "Weekend Essentials", detail: "Bundle offers for pantry staples.", icon: ShoppingBag },
  { title: "Birthday Booster", detail: "Celebrate with exclusive vouchers.", icon: Gift },
];

const iconRotation: LucideIcon[] = [Trophy, ShoppingBag, Gift];

export function OffersPage() {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listOffers()
      .then((res) => {
        if (!active) return;
        setOffers(res.offers);
      })
      .catch(() => {
        if (!active) return;
        setOffers([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const now = new Date();
  const liveOffers = useMemo(() => {
    const result = offers.filter((offer) => {
      if (!offer.active) return false;
      const starts = offer.startsAt ? new Date(offer.startsAt) : null;
      const ends = offer.endsAt ? new Date(offer.endsAt) : null;
      if (starts && starts > now) return false;
      if (ends && ends < now) return false;
      return true;
    });

    if (result.length === 0) {
      return fallbackOffers;
    }

    return result.map((offer, index) => ({
      title: offer.title,
      detail: offer.detail || "Exclusive in-store promotions for loyal shoppers.",
      icon: iconRotation[index % iconRotation.length],
    }));
  }, [offers]);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
      <Seo title="Offers & Promotions" description="Exclusive rewards and promotions for members." />
      <PageHeader
        title="Offers & Promotions"
        description="Timely rewards and seasonal programs designed for loyal customers."
      />
      
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {liveOffers.map((offer) => (
          <OfferCard
            key={offer.title}
            title={offer.title}
            detail={offer.detail}
            icon={offer.icon}
          />
        ))}
      </div>

      {loading && (
        <div className="mb-8">
          <Loader />
        </div>
      )}

      <div className="rounded-3xl bg-gradient-to-br from-brand-50/80 to-brand-100/40 border border-brand-200/60 p-8 md:p-12 text-center">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-4">
          Join Our Loyalty Program
        </h3>
        <p className="text-lg text-brand-700/90 max-w-2xl mx-auto">
          Unlock exclusive member benefits, personalized offers, and rewards every time you shop at Triple N Supermart.
        </p>
      </div>
    </div>
  );
}
