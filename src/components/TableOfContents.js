import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TOCContainer = styled.div`
  margin: var(--spacing-xl) 0;
  background: var(--dark);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius-sm);
  font-family: 'Roboto Mono', monospace;
  
  @media (min-width: 1200px) {
    position: sticky;
    top: var(--spacing-lg);
    max-height: calc(100vh - var(--spacing-2xl));
    overflow-y: auto;
  }
`;

const TOCHeader = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  color: var(--yellow);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background var(--transition-fast);
  
  &:hover {
    background: rgba(255, 221, 26, 0.1);
  }
  
  .arrow {
    transition: transform var(--transition-fast);
    transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
  }
`;

const TOCContent = styled.div`
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height var(--transition-medium) var(--easing-standard);
`;

const TOCList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 var(--spacing-md) var(--spacing-md) var(--spacing-md);
`;

const TOCItem = styled.li`
  margin: 0;
  padding: 0;
`;

const TOCLink = styled.a`
  display: block;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--grey);
  text-decoration: none;
  font-size: var(--font-size-small);
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
  margin-left: ${props => (props.$level - 2) * 16}px;
  
  &:hover {
    color: var(--yellow);
    background: rgba(255, 221, 26, 0.1);
    transform: translateX(4px);
  }
  
  &.active {
    color: var(--yellow);
    background: rgba(255, 221, 26, 0.1);
    border-left: 2px solid var(--yellow);
    padding-left: calc(var(--spacing-sm) - 2px);
  }
  
  &::before {
    content: '${props => props.$level === 2 ? '▸' : '·'}';
    margin-right: var(--spacing-xs);
    color: var(--yellow);
    opacity: 0.6;
  }
`;

const TableOfContents = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Track which heading is currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all headings
    const headingElements = headings.map(({ id }) => 
      document.getElementById(id)
    ).filter(Boolean);

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, [headings]);

  if (!headings || headings.length === 0) {
    return null;
  }

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for fixed header if you have one
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <TOCContainer>
      <TOCHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <span>📋 Table of Contents</span>
        <span className="arrow">▶</span>
      </TOCHeader>
      <TOCContent $isOpen={isOpen}>
        <TOCList>
          {headings.map(({ id, text, level }) => (
            <TOCItem key={id}>
              <TOCLink
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={activeId === id ? 'active' : ''}
                $level={level}
              >
                {text}
              </TOCLink>
            </TOCItem>
          ))}
        </TOCList>
      </TOCContent>
    </TOCContainer>
  );
};

export default TableOfContents;
