import React, { useState } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';
import Changelog from '../components/Changelog';

const TerminalCommand = styled.h2`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-p);
  margin-bottom: var(--spacing-md);
  
  span {
    color: var(--yellow);
  }
`;

const LastUpdated = styled.div`
  background-color: var(--dark);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  
  .meta-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .meta-label {
    color: var(--yellow);
    font-weight: bold;
  }
  
  .meta-value {
    color: var(--grey);
  }
  
  .commit-button {
    background: none;
    border: none;
    color: var(--grey);
    font-family: 'Roboto Mono', monospace;
    font-size: inherit;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: color var(--transition-fast) var(--easing-standard);
    
    &:hover {
      color: var(--yellow);
    }
  }
`;

const UsesSection = styled.section`
  margin-bottom: var(--spacing-2xl);
`;

const SectionTitle = styled.h2`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-p);
  margin-bottom: var(--spacing-lg);
  
  span {
    color: var(--yellow);
  }
  
  &::before {
    content: '# ';
    color: var(--yellow);
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Item = styled.div`
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--dark);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
  font-family: 'Roboto Mono', monospace;
  
  &:hover {
    transform: translateX(10px);
    box-shadow: 0 0 20px rgba(255, 221, 26, 0.1);
  }
  
  @media (max-width: 760px) {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
`;

const ItemEmoji = styled.span`
  font-size: var(--font-size-h3);
  min-width: 35px;
  flex-shrink: 0;
`;

const ItemName = styled.span`
  color: var(--yellow);
  font-size: var(--font-size-p);
  font-weight: bold;
  min-width: 150px;
  flex-shrink: 0;
  
  @media (max-width: 760px) {
    min-width: auto;
  }
`;

const ItemDescription = styled.span`
  color: var(--grey);
  font-size: var(--font-size-p);
  flex: 1;
  line-height: 1.6;
  
  a {
    color: var(--yellow);
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const hardwarePersonal = [
  { emoji: '🖥️', name: 'Desktop', description: 'Custom built AMD Ryzen 9 5950X 4th Gen, 64GB RAM, and 6TB of storage' },
  { emoji: '💻', name: 'Laptop', description: 'Macbook Pro M2 16"' },
  { emoji: '🖥️', name: 'Monitor', description: 'Two Samsung - Odyssey G51C 32" monitors' },
  { emoji: '🖱️', name: 'Mouse', description: 'Logitech - MX Master 3' },
  { emoji: '⌨️', name: 'Keyboard', description: 'Logitech - G915' },
  { emoji: '📱', name: 'Phone', description: 'iPhone 14 Pro Max' },
  { emoji: '⌚', name: 'Watch', description: 'Apple Watch Ultra' },
];

const hardwareWork = [
  { emoji: '💻', name: 'Laptop', description: 'Surface Laptop Studio' },
  { emoji: '🖥️', name: 'Monitors', description: '2 HP - 27" IPS LED Monitors' },
  { emoji: '🖱️', name: 'Mouse', description: 'Logitech - MX Master 3' },
  { emoji: '⌨️', name: 'Keyboard', description: 'Logitech - G815 (Same as the G915 except not wireless)' },
];

const streaming = [
  { emoji: '🎙️', name: 'Microphone', description: 'Shure SM7B' },
  { emoji: '🎧', name: 'Headphones', description: 'Sony MDR7506 Pro' },
  { emoji: '🎛️', name: 'Preamp', description: 'dbx 286s' },
  { emoji: '🎚️', name: 'Audio Interface', description: 'Focusrite Scarlett 2i2 (3rd Gen)' },
];

const software = [
  { emoji: '🔥', name: 'Terminal', description: 'Alacritty (Linux), HyperJS (Mac), and Windows Terminal Preview (Windows)' },
  { emoji: '🧑‍💻', name: 'Code Editor', description: 'VSCode and NeoVim' },
  { emoji: '📓', name: 'Note-taking', description: 'Notion for personal and OneNote for work' },
  { emoji: '📸', name: 'Screen Capture', description: 'ShareX on Windows - free and open source' },
];

const other = [
  { emoji: '☕', name: 'Coffee', description: 'Folgers' },
  { emoji: '📔', name: 'Notebook', description: 'Moleskine' },
  { emoji: '🛻', name: 'Vehicle', description: 'RAM 1500 Pickup' },
  { emoji: '🗃️', name: 'Desk', description: 'Custom butcher block with the Autonomous SmartDesk frame' },
  { emoji: '🧻', name: 'Toilet paper', description: 'Hey now, that is a weird question!' },
];

export default function UsesPage({ data }) {
  const gitData = data?.usesPageGitData;
  const [changelogOpen, setChangelogOpen] = useState(false);
  
  // Format date to "Month Day, Year"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <>
      <div className="item1">
        <h1>Uses</h1>

        {gitData && (
          <>
            <LastUpdated>
              <div className="meta-line">
                <div className="meta-item">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">{formatDate(gitData.date)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Commit:</span>
                  <button 
                    className="commit-button" 
                    onClick={() => setChangelogOpen(!changelogOpen)}
                  >
                    {gitData.hash}
                  </button>
                </div>
              </div>
            </LastUpdated>
            {changelogOpen && gitData.commits && (
              <Changelog slug="uses.js" commits={gitData.commits} />
            )}
          </>
        )}
        <p>
          I often get asked what type of software and hardware I use so I keep
          track of it all on this page. I change this up often so check back for
          regular updates.
        </p>
        <TerminalCommand>
          <span>$</span> cat ~/.config/uses.json
        </TerminalCommand>
        <UsesSection>
          <SectionTitle>Hardware (Personal)</SectionTitle>
          <ItemList>
            {hardwarePersonal.map((item) => (
              <Item key={item.name}>
                <ItemEmoji>{item.emoji}</ItemEmoji>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </ItemList>
        </UsesSection>

        <UsesSection>
          <SectionTitle>Hardware (Work)</SectionTitle>
          <ItemList>
            {hardwareWork.map((item) => (
              <Item key={item.name}>
                <ItemEmoji>{item.emoji}</ItemEmoji>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </ItemList>
        </UsesSection>

        <UsesSection>
          <SectionTitle>Streaming Equipment</SectionTitle>
          <ItemList>
            {streaming.map((item) => (
              <Item key={item.name}>
                <ItemEmoji>{item.emoji}</ItemEmoji>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </ItemList>
        </UsesSection>

        <UsesSection>
          <SectionTitle>Software</SectionTitle>
          <ItemList>
            <Item>
              <ItemEmoji>🔥</ItemEmoji>
              <ItemName>Terminal</ItemName>
              <ItemDescription>Alacritty (Linux), HyperJS (Mac), and Windows Terminal Preview (Windows)</ItemDescription>
            </Item>
            <Item>
              <ItemEmoji>🧑‍💻</ItemEmoji>
              <ItemName>Code Editor</ItemName>
              <ItemDescription>
                VSCode (<Link to="/jason-s-vs-code-config-2022/">config</Link>) and NeoVim (<Link to="/neovim-setup-on-windows-2022/">config</Link>)
              </ItemDescription>
            </Item>
            <Item>
              <ItemEmoji>📓</ItemEmoji>
              <ItemName>Note-taking</ItemName>
              <ItemDescription>Notion for personal and OneNote for work</ItemDescription>
            </Item>
            <Item>
              <ItemEmoji>📸</ItemEmoji>
              <ItemName>Screen Capture</ItemName>
              <ItemDescription>
                <a href="https://getsharex.com/" target="_blank" rel="noopener noreferrer">ShareX</a> on Windows - free and open source
              </ItemDescription>
            </Item>
          </ItemList>
        </UsesSection>

        <UsesSection>
          <SectionTitle>Other</SectionTitle>
          <ItemList>
            {other.map((item) => (
              <Item key={item.name}>
                <ItemEmoji>{item.emoji}</ItemEmoji>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </ItemList>
        </UsesSection>
      </div>
    </>
  );
}

export const pageQuery = graphql`
  query {
    usesPageGitData {
      hash
      date
      message
      commits {
        hash
        date
        message
      }
    }
  }
`;

export const Head = () => <SEO title="Uses" />;
