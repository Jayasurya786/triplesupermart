import React from 'react';
import styled from 'styled-components';

interface StyledOutlineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

const StyledOutlineButton = React.forwardRef<HTMLButtonElement, StyledOutlineButtonProps>(
  ({ children, onClick, href }, ref) => {
    if (href) {
      return (
        <StyledWrapper>
          <a href={href}>
            <button ref={ref} onClick={onClick}>
              {children}
            </button>
          </a>
        </StyledWrapper>
      );
    }

    return (
      <StyledWrapper>
        <button ref={ref} onClick={onClick}>
          {children}
        </button>
      </StyledWrapper>
    );
  }
);

StyledOutlineButton.displayName = 'StyledOutlineButton';

const StyledWrapper = styled.div`
  button {
    --green: #2aa369;
    font-size: 15px;
    padding: 0.7em 2.7em;
    letter-spacing: 0.06em;
    position: relative;
    font-family: inherit;
    border-radius: 0.6em;
    overflow: hidden;
    transition: all 0.3s;
    line-height: 1.4em;
    border: 2px solid var(--green);
    background: linear-gradient(to right, rgba(42, 163, 105, 0.1) 1%, transparent 40%, transparent 60%, rgba(42, 163, 105, 0.1) 100%);
    color: var(--green);
    box-shadow: inset 0 0 10px rgba(42, 163, 105, 0.4), 0 0 9px 3px rgba(42, 163, 105, 0.1);
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    width: 100%;
    max-width: 100%;
  }

  button:hover {
    color: #1f7a4a;
    border-color: #1f7a4a;
    box-shadow: inset 0 0 10px rgba(42, 163, 105, 0.6), 0 0 9px 3px rgba(42, 163, 105, 0.2);
  }

  button:before {
    content: "";
    position: absolute;
    left: -4em;
    width: 4em;
    height: 100%;
    top: 0;
    transition: transform 0.4s ease-in-out;
    background: linear-gradient(to right, transparent 1%, rgba(42, 163, 105, 0.2) 40%, rgba(42, 163, 105, 0.2) 60%, transparent 100%);
  }

  button:hover:before {
    transform: translateX(15em);
  }

  button:active {
    transform: scale(0.95);
  }

  a {
    text-decoration: none;
  }
`;

export default StyledOutlineButton;
