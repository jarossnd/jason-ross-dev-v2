import React, { useState, useEffect, useRef } from 'react';
import { navigate } from 'gatsby';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 2rem 2rem 2rem;
  z-index: 9999;
  animation: fadeIn 0.2s ease-in-out;
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const PaletteContainer = styled.div`
  background-color: var(--dark);
  border: 3px solid var(--yellow);
  border-radius: 15px;
  width: calc(100% - 4rem);
  max-width: 600px;
  box-shadow: 0 0 30px rgba(255, 221, 26, 0.5);
  animation: slideDown 0.2s ease-out;
  overflow: hidden;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media screen and (max-width: 760px) {
    width: calc(100% - 3rem);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 2rem;
  background-color: var(--blue);
  border: none;
  border-bottom: 2px solid var(--grey);
  color: var(--white);
  font-family: 'Roboto Mono', monospace;
  font-size: 2rem;
  outline: none;
  border-radius: 15px 15px 0 0;

  &::placeholder {
    color: var(--grey);
  }

  @media screen and (max-width: 760px) {
    font-size: 1.8rem;
    padding: 1.5rem;
  }
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 0.8rem;
  }

  &::-webkit-scrollbar-track {
    background: var(--dark);
    margin: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--yellow);
    border-radius: 0.5rem;
    border: 2px solid var(--dark);
  }
`;

const ResultItem = styled.li`
  padding: 1.5rem 2rem;
  cursor: pointer;
  background-color: ${props => props.isSelected ? 'var(--blue)' : 'transparent'};
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--blue);
  }

  &:last-child {
    border-radius: 0 0 15px 15px;
  }

  @media screen and (max-width: 760px) {
    padding: 1.2rem 1.5rem;
  }
`;

const ResultTitle = styled.div`
  color: var(--white);
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;

  @media screen and (max-width: 760px) {
    font-size: 1.6rem;
  }
`;

const ResultDescription = styled.div`
  color: var(--grey);
  font-size: 1.4rem;

  @media screen and (max-width: 760px) {
    font-size: 1.2rem;
  }
`;

const ResultIcon = styled.span`
  margin-right: 1rem;
  font-size: 2rem;
`;

const Hint = styled.div`
  padding: 1rem 2rem;
  color: var(--grey);
  font-size: 1.2rem;
  text-align: center;
  border-top: 1px solid var(--grey);
`;

const commands = [
  { id: 'home', title: 'Home', description: 'Go to homepage', icon: '🏠', path: '/' },
  { id: 'blog', title: 'Blog Posts', description: 'View all blog posts', icon: '📝', path: '/posts' },
  { id: 'about', title: 'About', description: 'Learn more about me', icon: '👤', path: '/about' },
  { id: 'contact', title: 'Contact', description: 'Get in touch', icon: '✉️', path: '/contact' },
  // { id: 'resume', title: 'Resume', description: 'View my resume', icon: '📄', path: '/resume' },
  { id: 'uses', title: 'Uses', description: 'Tools and software I use', icon: '🛠️', path: '/uses' },
  { id: 'topics', title: 'Topics', description: 'Browse by topic', icon: '🏷️', path: '/topics' },
  { id: 'donate', title: 'Donate', description: 'Support my work', icon: '💖', path: '/donate' },
];

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setSearchTerm('');
        setSelectedIndex(0);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      // Arrow navigation when palette is open
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            navigate(filteredCommands[selectedIndex].path);
            setIsOpen(false);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <PaletteContainer>
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Type a command or search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Command palette search"
        />
        <ResultsList>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <ResultItem
                key={cmd.id}
                isSelected={index === selectedIndex}
                onClick={() => handleSelect(cmd.path)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <ResultTitle>
                  <ResultIcon>{cmd.icon}</ResultIcon>
                  {cmd.title}
                </ResultTitle>
                <ResultDescription>{cmd.description}</ResultDescription>
              </ResultItem>
            ))
          ) : (
            <ResultItem>
              <ResultDescription>No results found</ResultDescription>
            </ResultItem>
          )}
        </ResultsList>
        <Hint>
          Press <strong>↑↓</strong> to navigate, <strong>↵</strong> to select, <strong>Esc</strong> to close
        </Hint>
      </PaletteContainer>
    </Overlay>
  );
};

export default CommandPalette;
