import React from 'react';
import styled from 'styled-components';

interface GetStartedButtonProps {
  onClick?: () => void;
}

const GetStartedButton = ({ onClick }: GetStartedButtonProps) => {
  return (
    <StyledWrapper>
      <button type="button" onClick={onClick} className="cssbuttons-io-button">
        Get started
        <div className="icon">
          <svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" />
          </svg>
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cssbuttons-io-button {
    background: #2aa369;
    color: white;
    font-family: inherit;
    padding: 0.35em;
    padding-left: 1.2em;
    font-size: 17px;
    font-weight: 600;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 100%;
    box-shadow: inset 0 0 1.6em -0.6em #1f7a4a;
    overflow: hidden;
    position: relative;
    height: 2.8em;
    padding-right: 3.3em;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .cssbuttons-io-button .icon {
    background: white;
    margin-left: 1em;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.2em;
    width: 2.2em;
    border-radius: 0.7em;
    box-shadow: 0.1em 0.1em 0.6em 0.2em #185c39;
    right: 0.3em;
    transition: all 0.3s;
  }

  .cssbuttons-io-button:hover {
    background: #1f7a4a;
    box-shadow: inset 0 0 1.6em -0.6em #0d2b1c;
  }

  .cssbuttons-io-button:hover .icon {
    width: calc(100% - 0.6em);
    box-shadow: 0.1em 0.1em 0.6em 0.2em #0d2b1c;
  }

  .cssbuttons-io-button .icon svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: #2aa369;
  }

  .cssbuttons-io-button:hover .icon svg {
    transform: translateX(0.1em);
    color: #185c39;
  }

  .cssbuttons-io-button:active {
    transform: scale(0.98);
  }

  .cssbuttons-io-button:active .icon {
    transform: scale(0.95);
  }
`;

export default GetStartedButton;
