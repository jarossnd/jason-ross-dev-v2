import React from 'react';
import Layout from './src/components/Layout';
import './prismjs/themes/prism-custom.css';

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>;
}

// Handle utterances OAuth redirect
export const onRouteUpdate = ({ location }) => {
  if (location.search && location.search.includes('utterances=')) {
    // Store the original page path before OAuth redirect
    const params = new URLSearchParams(location.search);
    const utterancesParam = params.get('utterances');
    
    if (utterancesParam) {
      // Send message to utterances iframe to complete authentication
      const message = {
        type: 'utterances',
        data: utterancesParam,
      };
      
      // Post message to all iframes (utterances will be listening)
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src && iframe.src.includes('utteranc.es')) {
          iframe.contentWindow.postMessage(message, 'https://utteranc.es');
        }
      });
      
      // Clean up the URL
      params.delete('utterances');
      const newSearch = params.toString();
      const newUrl = location.pathname + (newSearch ? `?${newSearch}` : '') + location.hash;
      
      // Replace the URL without triggering navigation
      if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState({}, '', newUrl);
      }
    }
  }
};
