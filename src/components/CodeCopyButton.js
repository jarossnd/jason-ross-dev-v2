import React, { useEffect } from 'react';

const CodeCopyButton = () => {
  useEffect(() => {
    // Add copy buttons to all code blocks after page loads
    const addCopyButtons = () => {
      // Try multiple selectors to find code blocks
      const codeBlocks = document.querySelectorAll('pre[class*="language-"], pre code, .gatsby-highlight pre');
      
      console.log('Found code blocks:', codeBlocks.length);
      
      codeBlocks.forEach((preBlock) => {
        // Ensure we're working with the pre element
        const pre = preBlock.tagName === 'PRE' ? preBlock : preBlock.closest('pre');
        
        if (!pre) {
          console.log('No pre element found');
          return;
        }

        // Skip if button already exists
        if (pre.parentNode.classList?.contains('code-block-wrapper')) {
          console.log('Wrapper already exists');
          return;
        }

        console.log('Adding copy button to:', pre);

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        // Add button to wrapper
        wrapper.appendChild(button);

        // Copy functionality
        button.addEventListener('click', async () => {
          const code = pre.querySelector('code') || pre;
          const text = code.innerText || code.textContent;

          try {
            await navigator.clipboard.writeText(text);
            button.textContent = 'Copied!';
            button.classList.add('copied');

            setTimeout(() => {
              button.textContent = 'Copy';
              button.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
            button.textContent = 'Error';
            setTimeout(() => {
              button.textContent = 'Copy';
            }, 2000);
          }
        });
      });
    };

    // Run once on mount with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      console.log('Running addCopyButtons...');
      addCopyButtons();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default CodeCopyButton;
