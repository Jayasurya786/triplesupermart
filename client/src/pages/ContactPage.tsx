import { PageHeader } from "@/components/ui/PageHeader";
import { LocationMap } from "@/components/common/LocationMap";
import { Seo } from "@/seo/Seo";
import { MapPin, Phone, Clock, ShoppingBag, Croissant } from "lucide-react";
import styled from "styled-components";

export function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-16">
      <Seo title="Contact" description="Reach Triple N Supermart at our locations." />
      <PageHeader
        title="Contact Us"
        description="Visit us at either of our locations or reach out for support."
      />

      {/* Location Details Cards */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-900 mb-8 text-center">
          Contact & Details
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {/* Kaki Bukit Location */}
        <LocationCard>
          <div className="header">
            <div className="icon-badge">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="location-name">Triple N Supermart Pte. Ltd.</h3>
              <p className="location-area">Kaki Bukit</p>
            </div>
          </div>

          <div className="divider" />

          <div className="details">
            <ContactDetail icon={MapPin}>
              <div>
                <strong>Address</strong>
                <p>7 Kaki Bukit Avenue 3</p>
                <p>Singapore 415814</p>
              </div>
            </ContactDetail>

            <ContactDetail icon={Phone}>
              <div>
                <strong>Phone</strong>
                <a href="tel:+6591065062" className="phone-link">
                  +65 9106 5062
                </a>
              </div>
            </ContactDetail>

            <ContactDetail icon={Clock}>
              <div>
                <strong>Hours</strong>
                <p>Daily: 7:30 AM - 11:30 PM</p>
              </div>
            </ContactDetail>
          </div>

          <div className="divider" />

          <p className="specialty">
            🛒 Comprehensive grocery and provision hub with in-store shopping, pickup, and delivery services.
          </p>
        </LocationCard>

        {/* Bukit Batok Location */}
        <LocationCard $alternate>
          <div className="header">
            <div className="icon-badge alternate">
              <Croissant className="w-6 h-6" />
            </div>
            <div>
              <h3 className="location-name">Triple N Supermart @ 323</h3>
              <p className="location-area">Bukit Batok</p>
            </div>
          </div>

          <div className="divider" />

          <div className="details">
            <ContactDetail icon={MapPin}>
              <div>
                <strong>Address</strong>
                <p>323 Bukit Batok Street 33</p>
                <p>#01-110, Singapore 650323</p>
              </div>
            </ContactDetail>

            <ContactDetail icon={Phone}>
              <div>
                <strong>Phone</strong>
                <a href="tel:+6565673111" className="phone-link">
                  +65 6567 3111
                </a>
              </div>
            </ContactDetail>

            <ContactDetail icon={Clock}>
              <div>
                <strong>Hours</strong>
                <p>Daily: 9:30 AM - 10:30 PM</p>
              </div>
            </ContactDetail>
          </div>

          <div className="divider" />

          <p className="specialty">
            🥖 Mini-mart with specialty bakery products and artisanal confectionery manufacturing.
          </p>
        </LocationCard>
      </div>

      {/* CTA Section */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-50/80 to-brand-100/40 border border-brand-200/60 p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-6">
          Visit Us Today
        </h2>
        <p className="text-lg text-brand-700/90 max-w-2xl mx-auto leading-8">
          Experience the Triple N Supermart difference. Whether you choose our Kaki Bukit hub or heritage Bukit Batok location, we're ready to serve you with quality, freshness, and exceptional customer care.
        </p>
      </section>

      {/* Interactive Map */}
      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-display font-bold text-brand-900 mb-6 text-center">
          Store Map
        </h2>
        <MapContainer>
          <LocationMap />
        </MapContainer>
      </div>
    </div>
  );
}

function ContactDetail({
  icon: Icon,
  children,
}: {
  icon: React.FC<any>;
  children: React.ReactNode;
}) {
  return (
    <div className="contact-detail">
      <Icon className="icon" />
      <div className="content">{children}</div>
    </div>
  );
}

const LocationCard = styled.div<{ $alternate?: boolean }>`
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

  .header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }

  .icon-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #eefbf3 0%, #d8f6e4 100%);
    border-radius: 14px;
    color: #2aa369;
    flex-shrink: 0;
    transition: all 0.45s ease-in-out;

    ${({ $alternate }) =>
      $alternate && `
        background: linear-gradient(135deg, #d8f6e4 0%, #b1ebca 100%);
        color: #1f7a4a;
      `}
  }

  &:hover .icon-badge {
    transform: scale(1.1);
    box-shadow: 0 8px 24px rgba(42, 163, 105, 0.15);
  }

  .location-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0d2b1c;
    margin: 0 0 4px 0;
    font-family: inherit;
  }

  .location-area {
    font-size: 0.9rem;
    color: #2aa369;
    font-weight: 600;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, #d8f6e4, transparent);
    margin: 24px 0;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .contact-detail {
    display: flex;
    align-items: flex-start;
    gap: 14px;

    .icon {
      width: 22px;
      height: 22px;
      color: #2aa369;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .content {
      font-size: 0.95rem;
      color: #1f7a4a;
      line-height: 1.6;

      strong {
        display: block;
        color: #0d2b1c;
        font-weight: 700;
        margin-bottom: 4px;
      }

      p {
        margin: 0;
        color: #1f7a4a;
      }

      .phone-link {
        color: #2aa369;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-block;

        &:hover {
          color: #1f7a4a;
          text-decoration: underline;
        }
      }
    }
  }

  .specialty {
    font-size: 0.95rem;
    color: #1f7a4a;
    line-height: 1.7;
    margin: 0;
    padding: 16px;
    background: #eefbf3/50;
    border-radius: 12px;
    border-left: 3px solid #2aa369;
  }

  @media (max-width: 640px) {
    padding: 24px;

    .header {
      gap: 12px;
    }

    .location-name {
      font-size: 1.1rem;
    }

    .icon-badge {
      width: 48px;
      height: 48px;
    }
  }
`;

const MapContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f5fbf7 100%);
  border: 2px solid #d8f6e4;
  border-radius: 22px;
  padding: 14px;
  box-shadow: 0 10px 40px rgba(18, 64, 42, 0.12);
  max-width: 560px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 12px;
    border-radius: 18px;
  }
`;

