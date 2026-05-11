import React from 'react';
import styled from 'styled-components';
import { Zap, Leaf, Package, type LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  background: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description, background }) => {
  return (
    <StyledWrapper>
      <div className="card" style={{ background }}>
        <div className="card-content">
          <div className="card-icon">
            <Icon size={42} />
          </div>
          <p className="card-title">{title}</p>
          <p className="card-para">{description}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const FeatureCards: React.FC = () => {
  const features = [
    {
      Icon: Zap,
      title: 'Fresh Spices',
      description: 'Bold, aromatic spices chosen for authentic flavor.',
      background: 'linear-gradient(135deg, #ff6b35 0%, #d1207c 100%)'
    },
    {
      Icon: Leaf,
      title: 'Daily Vegetables',
      description: 'Crisp, farm-fresh greens picked every morning.',
      background: 'linear-gradient(135deg, #2ecc71 0%, #1d8f5b 100%)'
    },
    {
      Icon: Package,
      title: 'Premium Rice',
      description: 'Soft, fragrant rice for every hearty meal.',
      background: 'linear-gradient(135deg, #f5d76e 0%, #d89e2a 100%)'
    }
  ];

  return (
    <CardsContainer>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          Icon={feature.Icon}
          title={feature.title}
          description={feature.description}
          background={feature.background}
        />
      ))}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  justify-items: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    max-width: 320px;
    min-height: 250px;
    background-color: #4158D0;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    border-radius: 8px;
    color: white;
    overflow: hidden;
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  @media (max-width: 640px) {
    .card {
      height: auto;
      padding: 1.5rem 1.25rem;
    }
  }

  .card-content {
    padding: 20px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    color: white;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 100%;
  }

  .card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(8px);
    margin-bottom: 12px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  }

  .card-content .card-title {
    font-size: 20px;
    font-weight: 700;
    color: inherit;
    text-transform: uppercase;
    margin: 0;
  }

  .card-content .card-para {
    color: inherit;
    opacity: 0.9;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
  }

  .card:hover {
    transform: rotateY(10deg) rotateX(10deg) scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }

  .card:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    z-index: 1;
  }

  .card:hover:before {
    transform: translateX(-100%);
  }

  .card:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    z-index: 1;
  }

  .card:hover:after {
    transform: translateX(100%);
  }
`;

export default FeatureCards;