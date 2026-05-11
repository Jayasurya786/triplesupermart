import styled from "styled-components";
import { type LucideIcon } from "lucide-react";

interface ProductShowcaseCardProps {
  title: string;
  description: string;
  icon: string | LucideIcon;
}

export default function ProductShowcaseCard({ title, description, icon }: ProductShowcaseCardProps) {
  const isLucideIcon = typeof icon !== "string";
  const IconComponent = isLucideIcon ? (icon as LucideIcon) : null;

  return (
    <StyledWrapper>
      <article className="card" aria-label={title}>
        <div className="border" />
        <div className="content">
          <div className="logo" aria-hidden="true">
            {isLucideIcon && IconComponent ? (
              <>
                <IconComponent className="icon-svg" strokeWidth={1.5} />
              </>
            ) : (
              <>
                <span className="logo1">{icon}</span>
                <span className="logo2">{icon}</span>
                <span className="trail" />
              </>
            )}
          </div>
          <h3 className="title">{title}</h3>
          <p className="description">{description}</p>
        </div>
        <span className="bottom-text">featured category</span>
      </article>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    min-height: 220px;
    background: linear-gradient(165deg, #ffffff 0%, #f5fbf7 100%);
    border: 1px solid #d8f6e4;
    position: relative;
    display: grid;
    place-content: center;
    border-radius: 18px;
    overflow: hidden;
    transition: all 0.45s ease-in-out;
    box-shadow: 0 10px 30px rgba(18, 64, 42, 0.12);
    padding: 24px;
  }

  .border {
    position: absolute;
    inset: 0;
    border: 2px solid #2aa369;
    opacity: 0;
    transform: rotate(8deg);
    transition: all 0.45s ease-in-out;
    border-radius: 14px;
  }

  .content {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 10px;
    justify-items: start;
    transition: all 0.45s ease-in-out;
  }

  .logo {
    height: 44px;
    position: relative;
    width: 44px;
    overflow: hidden;
    transition: all 0.8s ease-in-out;
    border-radius: 12px;
    background: #eefbf3;
    border: 1px solid #b1ebca;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-svg {
    color: #2aa369;
    width: 24px;
    height: 24px;
    transition: all 0.45s ease-in-out;
  }

  .logo1,
  .logo2 {
    height: 44px;
    width: 44px;
    position: absolute;
    top: 0;
    display: grid;
    place-content: center;
    font-size: 22px;
  }

  .logo1 {
    left: 0;
  }

  .logo2 {
    left: 44px;
  }

  .trail {
    position: absolute;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
  }

  .title {
    margin: 2px 0 0;
    font-size: 1.2rem;
    line-height: 1.35;
    color: #0d2b1c;
    font-weight: 700;
  }

  .description {
    margin: 0;
    color: #185c39;
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .bottom-text {
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);
    font-size: 0.62rem;
    text-transform: uppercase;
    padding: 0 8px;
    color: #1f7a4a;
    background: #f5fbf7;
    opacity: 0;
    letter-spacing: 0.24em;
    transition: all 0.45s ease-in-out;
    white-space: nowrap;
  }

  .card:hover {
    border-radius: 12px;
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 18px 35px rgba(18, 64, 42, 0.18);
  }

  .card:hover .logo {
    width: 92px;
    animation: opacity 1s ease-in-out;
  }

  .card:hover .icon-svg {
    transform: scale(1.15);
  }

  .card:hover .border {
    inset: 12px;
    opacity: 1;
    transform: rotate(0);
  }

  .card:hover .bottom-text {
    opacity: 1;
    letter-spacing: 0.18em;
  }

  .card:hover .trail {
    animation: trail 1s ease-in-out;
  }

  @keyframes opacity {
    0% {
      border-right: 1px solid transparent;
    }

    10% {
      border-right: 1px solid #2aa369;
    }

    80% {
      border-right: 1px solid #2aa369;
    }

    100% {
      border-right: 1px solid transparent;
    }
  }

  @keyframes trail {
    0% {
      background: linear-gradient(90deg, rgba(42, 163, 105, 0) 90%, rgba(42, 163, 105, 1) 100%);
      opacity: 0;
    }

    30% {
      background: linear-gradient(90deg, rgba(42, 163, 105, 0) 70%, rgba(42, 163, 105, 1) 100%);
      opacity: 1;
    }

    70% {
      background: linear-gradient(90deg, rgba(42, 163, 105, 0) 70%, rgba(42, 163, 105, 1) 100%);
      opacity: 1;
    }

    95% {
      background: linear-gradient(90deg, rgba(42, 163, 105, 0) 90%, rgba(42, 163, 105, 1) 100%);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    .card {
      min-height: 200px;
    }

    .card:hover {
      transform: translateY(-2px);
    }
  }
`;
