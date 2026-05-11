import { PageHeader } from "@/components/ui/PageHeader";
import { Seo } from "@/seo/Seo";
import { MapPin, Clock, ShoppingBag, Briefcase, Award, UtensilsCrossed } from "lucide-react";
import styled from "styled-components";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
      <Seo title="About Us" description="Premium neighborhood supermarket with a loyalty focus." />
      <PageHeader
        title="About Triple N Supermart"
        description="Serving Singapore communities since 2009 with quality, diversity, and customer care across our locations."
      />

      {/* Introduction Section */}
      <section className="mb-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-50/80 to-brand-100/40 border border-brand-200/60 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-6">
            Our Story
          </h2>
          <p className="text-lg text-brand-700/90 leading-8 mb-4">
            Triple N Supermart operates as two distinct business entities in Singapore, each serving different local communities with unique operational focuses and deep-rooted commitment to quality service.
          </p>
          <p className="text-lg text-brand-700/90 leading-8">
            Built on the belief that loyalty is earned through experience, we provide comprehensive grocery solutions, personalized rewards, and trusted service that empowers our communities to thrive.
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-12 text-center">
          Our Locations
        </h2>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Kaki Bukit Location */}
          <LocationCard>
            <div className="icon-section">
              <div className="icon-badge">
                <MapPin className="w-6 h-6" />
              </div>
            </div>

            <h3 className="location-title">Triple N Supermart Pte. Ltd.</h3>
            <p className="location-subtitle">Kaki Bukit</p>

            <div className="location-details">
              <DetailItem icon={Briefcase}>
                <strong>Established:</strong> June 2018
              </DetailItem>
              <DetailItem icon={MapPin}>
                <strong>Address:</strong> 7 Kaki Bukit Ave 3, Singapore 415814
              </DetailItem>
              <DetailItem icon={Clock}>
                <strong>Hours:</strong> Daily 7:30 AM - 11:30 PM
              </DetailItem>
            </div>

            <div className="divider" />

            <h4 className="detail-heading">Business Profile</h4>
            <p className="detail-text">
              Comprehensive grocery and provision hub within an industrial and recreational zone. An Exempt Private Company Limited by Shares with a paid-up capital of $100,000.
            </p>

            <h4 className="detail-heading">Services</h4>
            <div className="services-list">
              <ServiceBadge>In-store Shopping</ServiceBadge>
              <ServiceBadge>In-store Pickup</ServiceBadge>
              <ServiceBadge>Delivery</ServiceBadge>
              <ServiceBadge>Restaurant Ops</ServiceBadge>
            </div>

            <div className="divider" />

            <h4 className="detail-heading">Specialization</h4>
            <p className="detail-text">
              Wide range of daily needs at reasonable prices with the feel of an Indian supermarket, offering diverse food services at the Kaki Bukit Recreation Centre.
            </p>
          </LocationCard>

          {/* Bukit Batok Location */}
          <LocationCard>
            <div className="icon-section">
              <div className="icon-badge alternate">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
            </div>

            <h3 className="location-title">Triple N Supermart @ 323</h3>
            <p className="location-subtitle">Bukit Batok</p>

            <div className="location-details">
              <DetailItem icon={Briefcase}>
                <strong>Established:</strong> October 2009
              </DetailItem>
              <DetailItem icon={MapPin}>
                <strong>Address:</strong> 323 Bukit Batok Street 33, #01-110, Singapore 650323
              </DetailItem>
              <DetailItem icon={Clock}>
                <strong>Hours:</strong> Daily 9:30 AM - 11:00 PM
              </DetailItem>
            </div>

            <div className="divider" />

            <h4 className="detail-heading">Business Profile</h4>
            <p className="detail-text">
              The older of the two locations, operating as a partnership since October 2009. Previously known as Mufiz Mini Mart before rebranding as Triple N Supermart.
            </p>

            <h4 className="detail-heading">Services</h4>
            <div className="services-list">
              <ServiceBadge>Mini Mart</ServiceBadge>
              <ServiceBadge>Convenience Items</ServiceBadge>
              <ServiceBadge>Fresh Bakery</ServiceBadge>
              <ServiceBadge>Confectionery</ServiceBadge>
            </div>

            <div className="divider" />

            <h4 className="detail-heading">Specialization</h4>
            <p className="detail-text">
              Registered for manufacturing of bread, cakes, and confectionery. Beyond standard mini-mart items, offering freshly baked goods and artisanal confectionery products.
            </p>
          </LocationCard>
        </div>
      </section>

      {/* Community Values */}
      <section className="mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Committed to Community
          </h3>
          <p className="text-lg text-white/90 max-w-3xl mx-auto leading-8">
            Whether you visit our Kaki Bukit hub or our heritage Bukit Batok location, you'll find the same commitment to quality, diversity, and personalized service that has made Triple N Supermart a trusted name in Singapore communities.
          </p>
        </div>
      </section>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  children,
}: {
  icon: React.FC<any>;
  children: React.ReactNode;
}) {
  return (
    <div className="detail-item">
      <Icon className="icon" />
      <span>{children}</span>
    </div>
  );
}

function ServiceBadge({ children }: { children: React.ReactNode }) {
  return <span className="service-badge">{children}</span>;
}

const LocationCard = styled.div`
  background: linear-gradient(165deg, #ffffff 0%, #f5fbf7 100%);
  border: 1px solid #d8f6e4;
  border-radius: 24px;
  padding: 32px;
  transition: all 0.45s ease-in-out;
  box-shadow: 0 10px 30px rgba(18, 64, 42, 0.1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(18, 64, 42, 0.15);
    border-color: #b1ebca;
  }

  .icon-section {
    margin-bottom: 24px;
  }

  .icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #eefbf3 0%, #d8f6e4 100%);
    border-radius: 16px;
    color: #2aa369;
    box-shadow: 0 4px 12px rgba(42, 163, 105, 0.1);
    transition: all 0.45s ease-in-out;

    &.alternate {
      background: linear-gradient(135deg, #d8f6e4 0%, #b1ebca 100%);
      color: #1f7a4a;
    }
  }

  &:hover .icon-badge {
    transform: scale(1.15);
    box-shadow: 0 8px 24px rgba(42, 163, 105, 0.2);
  }

  .location-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0d2b1c;
    margin: 0 0 8px 0;
    font-family: inherit;
  }

  .location-subtitle {
    font-size: 0.95rem;
    color: #2aa369;
    font-weight: 600;
    margin: 0 0 24px 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .location-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .detail-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.95rem;
    color: #1f7a4a;
    line-height: 1.6;

    .icon {
      width: 20px;
      height: 20px;
      color: #2aa369;
      flex-shrink: 0;
      margin-top: 2px;
    }
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, #d8f6e4, transparent);
    margin: 24px 0;
  }

  .detail-heading {
    font-size: 1rem;
    font-weight: 700;
    color: #0d2b1c;
    margin: 12px 0 8px 0;
    font-family: inherit;
  }

  .detail-text {
    font-size: 0.95rem;
    color: #1f7a4a;
    line-height: 1.7;
    margin: 0 0 16px 0;
  }

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .service-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    background: #eefbf3;
    border: 1px solid #d8f6e4;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1f7a4a;
    white-space: nowrap;
    transition: all 0.3s ease;

    &:hover {
      background: #d8f6e4;
      border-color: #b1ebca;
    }
  }

  @media (max-width: 640px) {
    padding: 24px;

    .location-title {
      font-size: 1.3rem;
    }

    .icon-badge {
      width: 56px;
      height: 56px;
    }
  }
`;

