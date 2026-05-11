import styled from "styled-components";
import { type LucideIcon } from "lucide-react";

interface OfferCardProps {
  title: string;
  detail: string;
  icon: LucideIcon;
}

export default function OfferCard({ title, detail, icon: IconComponent }: OfferCardProps) {
  return (
    <StyledWrapper>
      <article className="card" aria-label={title}>
        <div className="border" />
        
        <div className="content">
          <div className="icon-container">
            <IconComponent className="icon-svg" strokeWidth={1.5} />
          </div>
          
          <div className="text-section">
            <h3 className="title">{title}</h3>
            <p className="detail">{detail}</p>
          </div>
        </div>

        <div className="accent-bar" />
      </article>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    min-height: 240px;
    background: linear-gradient(165deg, #ffffff 0%, #f5fbf7 100%);
    border: 1px solid #d8f6e4;
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.45s ease-in-out;
    box-shadow: 0 10px 30px rgba(18, 64, 42, 0.1);
    padding: 28px;
  }

  .border {
    position: absolute;
    inset: 0;
    border: 2px solid #2aa369;
    opacity: 0;
    transform: rotate(8deg);
    transition: all 0.45s ease-in-out;
    border-radius: 16px;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }

  .icon-container {
    height: 56px;
    width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: linear-gradient(135deg, #eefbf3 0%, #d8f6e4 100%);
    border: 1px solid #b1ebca;
    transition: all 0.45s ease-in-out;
    box-shadow: 0 4px 12px rgba(42, 163, 105, 0.08);
  }

  .icon-svg {
    color: #2aa369;
    width: 28px;
    height: 28px;
    transition: all 0.45s ease-in-out;
  }

  .text-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .title {
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.4;
    color: #0d2b1c;
    font-weight: 700;
    font-family: inherit;
  }

  .detail {
    margin: 0;
    color: #1f7a4a;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .accent-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 0;
    background: linear-gradient(90deg, #2aa369, #1f7a4a);
    transition: width 0.45s ease-in-out;
  }

  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 40px rgba(18, 64, 42, 0.16);
    border-color: #b1ebca;
  }

  .card:hover .border {
    inset: 8px;
    opacity: 1;
    transform: rotate(0);
  }

  .card:hover .icon-container {
    background: linear-gradient(135deg, #d8f6e4 0%, #b1ebca 100%);
    box-shadow: 0 8px 24px rgba(42, 163, 105, 0.15);
    transform: scale(1.1);
  }

  .card:hover .icon-svg {
    transform: scale(1.15);
  }

  .card:hover .accent-bar {
    width: 100%;
  }

  @media (max-width: 640px) {
    .card {
      min-height: 220px;
      padding: 24px;
    }

    .icon-container {
      height: 48px;
      width: 48px;
    }

    .icon-svg {
      width: 24px;
      height: 24px;
    }

    .title {
      font-size: 1.1rem;
    }

    .detail {
      font-size: 0.9rem;
    }

    .card:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
`;
