import React from 'react';
import styled from 'styled-components';

interface MapLocation {
  x: number;
  y: number;
  name: string;
  area: string;
  icon: string;
  phone: string;
  address: string;
  hours: string;
}

interface LocationMapProps {
  locations?: MapLocation[];
}

const defaultLocations: MapLocation[] = [
  {
    x: 35,
    y: 45,
    name: 'Kaki Bukit',
    area: 'Triple N Supermart Pte. Ltd.',
    icon: '🛒',
    phone: '+65 9106 5062',
    address: '7 Kaki Bukit Ave 3',
    hours: '7:30 AM - 11:30 PM',
  },
  {
    x: 28,
    y: 68,
    name: 'Bukit Batok',
    area: 'Triple N Supermart @ 323',
    icon: '🥖',
    phone: '+65 6567 3111',
    address: '323 Bukit Batok Street 33',
    hours: '9:30 AM - 10:30 PM',
  },
];

export function LocationMap({ locations = defaultLocations }: LocationMapProps) {
  return (
    <StyledWrapper>
      <div className="map-container">
        <svg viewBox="0 0 500 500" className="map-background">
          <rect style={{ fill: '#eefbf3' }} width={500} height={500} />
          {/* Singapore simplified silhouette */}
          <path
            style={{ fill: '#d8f6e4' }}
            d="M200,150 L250,140 L280,160 L270,200 L300,220 L320,250 L310,280 L280,290 L250,310 L220,320 L200,300 L180,280 L170,250 L180,220 L190,190 Z"
          />
          {/* Water areas */}
          <path
            style={{ fill: '#b1ebca', opacity: '0.3' }}
            d="M150,100 L350,80 L380,200 L400,350 L320,380 L150,370 L120,300 L100,200 Z"
          />
        </svg>
        <div className="map-cities">
          {locations.map((location, idx) => (
            <div
              key={idx}
              style={{
                '--x': `${location.x}`,
                '--y': `${location.y}`,
              } as React.CSSProperties}
              className="map-city"
            >
              <div className="map-city__label">
                <span className="map-city__sign">
                  <span className="map-city__icon">{location.icon}</span>
                  <span className="map-city__text">
                    <strong>{location.name}</strong>
                    <small>{location.area}</small>
                    <small>{location.phone}</small>
                    <small>{location.hours}</small>
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .map-container {
    --city-radius: 2rem;
    --city-sign-color-back: #2aa369;
    --city-sign-color-font: #fff;
    --city-pin-size-font: 1.2rem;
    
    border-radius: 0.5em;
    box-shadow: 0 10px 30px rgba(18, 64, 42, 0.15);
    line-height: 1;
    min-width: 15rem;
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
  }

  .map-background {
    border-radius: inherit;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .map-cities {
    width: 100%;
    height: 100%;
  }

  .map-city {
    border-radius: var(--city-radius);
    left: calc(var(--x) * 1% - var(--city-radius));
    padding: var(--city-radius);
    position: absolute;
    top: calc(var(--y) * 1% - var(--city-radius));
    cursor: pointer;
    z-index: 10;
  }

  .map-city::after,
  .map-city::before {
    font-size: var(--city-pin-size-font);
  }

  .map-city::before {
    content: '📍';
    left: calc(-50% + var(--city-radius));
    position: absolute;
    top: calc(-0.65em + var(--city-radius));
    text-align: center;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    width: 100%;
    transition: all 300ms ease-out;
  }

  .map-city::after {
    content: '•';
    left: calc(-50% + var(--city-radius));
    position: absolute;
    top: calc(-0.35em + var(--city-radius));
    text-align: center;
    width: 100%;
    color: #2aa369;
    font-size: 1.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .map-city__label {
    display: none;
    left: calc(-8em + 50%);
    position: absolute;
    text-align: left;
    width: 16em;
    z-index: 999;
    top: -2rem;
  }

  .map-city__sign {
    align-items: flex-start;
    background-color: var(--city-sign-color-back);
    border-radius: 0.6rem;
    border: 2px solid var(--city-sign-color-font);
    box-shadow: 0 4px 12px rgba(18, 64, 42, 0.25);
    color: var(--city-sign-color-font);
    column-gap: 0.8em;
    display: flex;
    font-weight: 700;
    padding: 0.8em;
    backdrop-filter: blur(10px);
    text-wrap: wrap;
  }

  .map-city__icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .map-city__text {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    font-size: 0.85rem;

    strong {
      font-weight: 700;
      color: #fff;
    }

    small {
      font-size: 0.75rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  /* Hover Effects */
  .map-city:hover::before {
    transform: translateY(-8px) scale(1.3);
    filter: drop-shadow(0 2px 4px rgba(42, 163, 105, 0.4));
  }

  .map-city:hover::after {
    transform: scale(1.4);
  }

  .map-city:hover .map-city__label {
    animation: fadein 300ms forwards ease-out;
    display: block;
  }

  @keyframes fadein {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .map-container {
      aspect-ratio: auto;
      min-height: 400px;
    }

    .map-city__label {
      left: calc(-7em + 50%);
      width: 14em;
    }

    .map-city__sign {
      padding: 0.6em;
      font-size: 0.9rem;
    }

    .map-city__icon {
      font-size: 1.2rem;
    }
  }
`;
