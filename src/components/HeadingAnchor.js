import React, { useEffect } from 'react';
import styled from 'styled-components';

const AnchorLink = styled.a`
  margin-left: var(--spacing-xs);
  color: var(--yellow);
  text-decoration: none;
  opacity: 0;
  transition: opacity var(--transition-fast);
  font-size: 0.8em;
  
  &:hover {
    opacity: 1 !important;
  }
`;

const HeadingWrapper = styled.span`
  position: relative;
  
  &:hover ${AnchorLink} {
    opacity: 0.6;
  }
`;

const HeadingAnchor = () => {
  useEffect(() => {
    // Add anchor links to all headings in the article
    const article = document.querySelector('article');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3, h4, h5, h6');
    
    headings.forEach((heading) => {
      // Skip if already processed
      if (heading.querySelector('.heading-anchor')) return;
      
      // Generate ID from heading text if it doesn't have one
      if (!heading.id) {
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        heading.id = id;
      }

      // Create anchor link
      const anchor = document.createElement('a');
      anchor.href = `#${heading.id}`;
      anchor.className = 'heading-anchor';
      anchor.innerHTML = '#';
      anchor.title = 'Copy link to this section';
      anchor.setAttribute('aria-label', `Link to ${heading.textContent}`);
      
      // Add click handler to copy link
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        
        // Copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            // Show temporary feedback
            const originalText = anchor.innerHTML;
            anchor.innerHTML = '✓';
            anchor.style.opacity = '1';
            setTimeout(() => {
              anchor.innerHTML = originalText;
            }, 1500);
          });
        } else {
          // Fallback: scroll to section
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      // Append to heading
      heading.appendChild(anchor);
    });

    // Apply styles via a style tag
    if (!document.getElementById('heading-anchor-styles')) {
      const style = document.createElement('style');
      style.id = 'heading-anchor-styles';
      style.innerHTML = `
        .heading-anchor {
          margin-left: var(--spacing-xs);
          color: var(--yellow);
          text-decoration: none;
          opacity: 0;
          transition: opacity var(--transition-fast);
          font-size: 0.8em;
        }
        
        .heading-anchor:hover {
          opacity: 1 !important;
        }
        
        h1:hover .heading-anchor,
        h2:hover .heading-anchor,
        h3:hover .heading-anchor,
        h4:hover .heading-anchor,
        h5:hover .heading-anchor,
        h6:hover .heading-anchor {
          opacity: 0.6;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return null; // This component doesn't render anything
};

export default HeadingAnchor;
