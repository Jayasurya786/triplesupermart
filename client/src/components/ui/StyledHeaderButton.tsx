import React from 'react';
import styled from 'styled-components';

interface StyledHeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

const StyledHeaderButton = React.forwardRef<HTMLButtonElement, StyledHeaderButtonProps>(
  ({ children, onClick, variant = 'primary' }, ref) => {
    return (
      <StyledWrapper $variant={variant}>
        <button ref={ref} onClick={onClick} className={`styled-btn styled-btn-${variant}`}>
          {children}
        </button>
      </StyledWrapper>
    );
  }
);

StyledHeaderButton.displayName = 'StyledHeaderButton';

interface StyledWrapperProps {
  $variant: 'primary' | 'outline';
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .styled-btn {
    font-size: 14px;
    padding: 0.6em 1.8em;
    letter-spacing: 0.05em;
    position: relative;
    font-family: inherit;
    border-radius: 0.5em;
    overflow: hidden;
    transition: all 0.3s;
    line-height: 1.4em;
    font-weight: 600;
    cursor: pointer;
  }

  /* Primary Button (Green Fill) */
  .styled-btn-primary {
    --green: #2aa369;
    border: 2px solid var(--green);
    background: linear-gradient(135deg, #2aa369 0%, #1f7a4a 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(42, 163, 105, 0.3);
  }

  .styled-btn-primary:hover {
    background: linear-gradient(135deg, #1f7a4a 0%, #185c39 100%);
    box-shadow: 0 6px 20px rgba(42, 163, 105, 0.4);
    transform: translateY(-2px);
  }

  .styled-btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(42, 163, 105, 0.2);
  }

  /* Outline Button (Green Border) */
  .styled-btn-outline {
    --green: #2aa369;
    border: 2px solid var(--green);
    background: linear-gradient(to right, rgba(42, 163, 105, 0.05) 1%, transparent 40%, transparent 60%, rgba(42, 163, 105, 0.05) 100%);
    color: var(--green);
    box-shadow: inset 0 0 8px rgba(42, 163, 105, 0.2), 0 0 8px 2px rgba(42, 163, 105, 0.1);
  }

  .styled-btn-outline:hover {
    color: #1f7a4a;
    border-color: #1f7a4a;
    box-shadow: inset 0 0 10px rgba(42, 163, 105, 0.4), 0 0 10px 2px rgba(42, 163, 105, 0.2);
    background: linear-gradient(to right, rgba(42, 163, 105, 0.1) 1%, transparent 40%, transparent 60%, rgba(42, 163, 105, 0.1) 100%);
  }

  .styled-btn-outline:before {
    content: "";
    position: absolute;
    left: -4em;
    width: 4em;
    height: 100%;
    top: 0;
    transition: transform 0.4s ease-in-out;
    background: linear-gradient(to right, transparent 1%, rgba(42, 163, 105, 0.15) 40%, rgba(42, 163, 105, 0.15) 60%, transparent 100%);
  }

  .styled-btn-outline:hover:before {
    transform: translateX(15em);
  }

  .styled-btn-outline:active {
    transform: scale(0.95);
  }
`;

export default StyledHeaderButton;
