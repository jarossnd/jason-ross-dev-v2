import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  background-color: var(--dark);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-md) 0;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);

  @media screen and (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
    font-size: var(--font-size-meta);
  }
`;

const SettingItem = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  color: var(--grey);
  transition: color var(--transition-fast) var(--easing-standard);

  &:hover {
    color: var(--yellow);
  }

  input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid var(--yellow);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    transition: all var(--transition-fast) var(--easing-standard);

    &:checked {
      background-color: var(--yellow);
    }

    &:checked::after {
      content: '✓';
      position: absolute;
      color: var(--dark);
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
    }

    &:hover {
      box-shadow: 0 0 8px rgba(255, 221, 26, 0.3);
    }
  }

  span {
    user-select: none;
  }
`;

const PostSettings = ({ onToggleMarkdownHashes }) => {
  const [showHashes, setShowHashes] = useState(true);

  useEffect(() => {
    // Load setting from localStorage
    const saved = localStorage.getItem('showMarkdownHashes');
    if (saved !== null) {
      const value = saved === 'true';
      setShowHashes(value);
      onToggleMarkdownHashes(value);
    }
  }, [onToggleMarkdownHashes]);

  const handleToggle = () => {
    const newValue = !showHashes;
    setShowHashes(newValue);
    localStorage.setItem('showMarkdownHashes', newValue);
    onToggleMarkdownHashes(newValue);
  };

  return (
    <SettingsContainer>
      <SettingItem>
        <input
          type="checkbox"
          checked={showHashes}
          onChange={handleToggle}
          aria-label="Toggle markdown header hashes"
        />
        <span>Show markdown # headers</span>
      </SettingItem>
    </SettingsContainer>
  );
};

export default PostSettings;
