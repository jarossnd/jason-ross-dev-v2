import React, { useEffect, useRef } from 'react';
import { useLocation } from '@reach/router';

const COMMENTS_ID = 'utterances-container';

const Comments = () => {
  const location = useLocation();
  const containerRef = useRef(null);

  useEffect(() => {
    // Only load utterances on client side
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    // Clear existing iframe
    const existingIframe = container.querySelector('iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    // Clear all children
    container.innerHTML = '';

    // Create and configure the script
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    
    // Use setAttribute for data attributes (utterances expects data attributes)
    script.setAttribute('repo', 'jarossnd/jason-ross-dev-comments');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'comments');
    script.setAttribute('theme', 'photon-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    // Append script to trigger utterances to load
    container.appendChild(script);

    return () => {
      // Clean up on unmount or when pathname changes
      if (container) {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          iframe.remove();
        }
      }
    };
  }, [location.pathname]); // Re-initialize when page changes

  return (
    <div 
      ref={containerRef}
      id={COMMENTS_ID}
      style={{
        marginTop: '2rem',
        marginBottom: '2rem'
      }}
    />
  );
};

export default Comments;
