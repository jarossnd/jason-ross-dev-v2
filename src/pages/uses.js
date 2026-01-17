import React from 'react';
import { Link } from 'gatsby';
import SEO from '../components/SEO';
import ContentContainer from '../components/ContentContainer';

const hardwarePersonal = [
  { emoji: '🖥️', name: 'Desktop', description: 'Custom built AMD Ryzen 9 5950X 4th Gen, 64GB RAM, and 6TB of storage' },
  { emoji: '💻', name: 'Laptop', description: 'Macbook Pro M2 16"' },
  { emoji: '🖥️', name: 'Monitor', description: 'Two Samsung - Odyssey G51C 32" monitors' },
  { emoji: '🖱️', name: 'Mouse', description: 'Logitech - MX Master 3' },
  { emoji: '⌨️', name: 'Keyboard', description: 'Logitech - G915' },
  { emoji: '📱', name: 'Phone', description: 'iPhone 14 Pro Max' },
  { emoji: '⌚', name: 'Watch', description: 'Apple Watch Ultra' },
];

export default function UsesPage() {
  return (
    <>
      <div className="item1">
        <h1>Uses</h1>
        <p>
          I often get asked what type of software and hardware I use so I keep
          track of it all on this page. I change this up often so check back for
          regular updates. This page was last updated on {new Date().toLocaleDateString()}.
        </p>
        <ContentContainer>
          <h2>Hardware (Personal)</h2>
          <ul>
            {hardwarePersonal.map((item) => (
              <li key={item.name}>
                {item.emoji} {item.name}: {item.description}
              </li>
            ))}
          </ul>
        </ContentContainer>
        <ContentContainer>
          <h2>Hardware (Work)</h2>
          <ul>
            <li>💻 Laptop: Surface Laptop Studio</li>
            <li>🖥️ 2 HP - 27" IPS LED Monitors</li>
            <li>🖱️ Mouse: Logitech - MX Master 3</li>
            <li>
              ⌨️ Keyboard: Logitech - G815 (Same as the G915 except not
              wireless)
            </li>
          </ul>
        </ContentContainer>
        <ContentContainer>
          <h2>Streaming Equipment</h2>
          <ul>
            <li>🎙️ Microphone: Shure SM7B</li>
            <li>🎧 Headphones: Sony MDR7506 Pro</li>
            <li>🎛️ Preamp: dbx 286s</li>
            <li>🎚️ Audio Interface: Focusrite Scarlett 2i2 (3rd Gen)</li>
          </ul>
        </ContentContainer>
        <ContentContainer>
          <h2>Software</h2>
          <ul>
            <li>
              🔥 Terminal: Alacritty (Linux) HyperJS (Mac) and Windows
              Terminal Preview(Windows)
            </li>
            <li>
              🧑‍💻 Code Editor: VSCode (
              <Link to="/jason-s-vs-code-config-2022/">config</Link>) and
              NeoVim (<Link to="/neovim-setup-on-windows-2022/">config</Link>)
            </li>
            <li>📓 Note-taking: Notion for personal and OneNote for work</li>
            <li>
              📸 Screen Capture on Windows:{' '}
              <a
                href="https://getsharex.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ShareX
              </a>{' '}
              which is free and open source
            </li>
          </ul>
        </ContentContainer>
        <ContentContainer>
          <h2>Other</h2>
          <ul>
            <li>☕ Coffee: Folgers</li>
            <li>📔 Notebook: Moleskine</li>
            <li>🛻 Vehicle: RAM 1500 Pickup</li>
            <li>
              🗃️ Desk: Custom butcher block with the Autonomous SmartDesk
              frame
            </li>
            <li>🧻 Toiletpaper: Hey now, that is a weird question!</li>
          </ul>
        </ContentContainer>
      </div>
    </>
  );
}

export const Head = () => <SEO title="Uses" />;
