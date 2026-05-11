import React from 'react';
import styled from 'styled-components';

interface ProductCardProps {
  title: string;
  brand?: string;
  origin?: string;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, image }) => {
  return (
    <StyledWrapper image={image}>
      <div className="card">
        <div className="title-chip">
          <p className="heading">{title}</p>
        </div>
        {/* Intentionally only show the product title to keep cards clean */}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ image?: string }>`
  .card {
    position: relative;
    width: 100%;
    height: 254px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 12px;
    gap: 12px;
    border-radius: 12px;
    cursor: pointer;
    color: #111827; /* dark text on white placeholder */
    overflow: hidden;
    isolation: isolate;
    background-image: ${p => p.image ? `url(${p.image})` : 'none'};
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 10px 24px rgba(34, 197, 94, 0.12);
  }

  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${p => p.image
      ? 'linear-gradient(to top, rgba(17,24,39,0.68) 0%, rgba(17,24,39,0.12) 34%, rgba(255,255,255,0.02) 68%)'
      : 'linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.70) 100%)'};
    pointer-events: none;
    z-index: 0;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    border-radius: 14px;
    background: linear-gradient(-45deg, rgba(34,197,94,0.18) 0%, rgba(167,243,208,0.24) 100%);
    z-index: -10;
    pointer-events: none;
    transition: opacity 0.3s ease;
    opacity: 0.55;
  }

  .title-chip {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-self: flex-start;
    max-width: 100%;
    margin-top: auto;
    padding: 8px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 24px rgba(34, 197, 94, 0.12);
  }

  .heading {
    font-size: 15px;
    line-height: 1.3;
    letter-spacing: 0;
    text-transform: none;
    font-weight: 600;
    margin: 0;
    color: #0f172a;
    text-shadow: none;
  }
  /* simplified card text styles - only title is displayed */

  .card:hover::after {
    opacity: 1;
  }

  .card:hover::before {
    opacity: 0.85;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 36px rgba(17, 24, 39, 0.14);
  }

  .card:hover .title-chip {
    transform: translateY(-2px);
  }
`;

export default ProductCard;
