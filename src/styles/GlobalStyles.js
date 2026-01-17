import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root {
        --red: #FF4949;
        --black: #2E2E2E;
        --yellow: #ffdd1a;
        --white: #ffffff;
        --grey: #e6e1dc;
        --dark: #202030;
        --blue: #0E0F19;
        --orange: #FE7F2D;
        --purple: #C04ABC;
        --green: #639A88;

        --font-size-h1: 5rem;
        --font-size-h2: 4rem;
        --font-size-h3: 3rem;
        --font-size-p: 3rem;
        --font-size-list: 3rem;
    }

    html {
        font-size: 8px;
        background-color: var(--blue);
        overflow-x: hidden; /* Prevent horizontal scroll */
    }

    body {
        font-family: 'Roboto Mono', 'Courier New', Courier, monospace;
        font-size: 2rem;
        color: var(--white);
        line-height: 1.5;
        padding-right: 2rem;
        padding-left: 2rem;
        overflow-y: scroll;
        overflow-x: hidden; /* Prevent horizontal scroll */
        max-width: 100vw;
    }

    a {
        color: var(--yellow);
        text-decoration: none;
    }

    a:hover {
        border-bottom: 3px solid var(--yellow);
        border-color: var(--yellow);
        border-bottom-color: var(--yellow);
    }

    /* Responsive images */
    img {
        max-width: 100%;
        height: auto;
    }

    /* Responsive videos */
    video,
    iframe {
        max-width: 100%;
    }

    /* Code blocks scrollable on mobile */
    pre {
        overflow-x: auto;
        max-width: 100%;
    }

    /* Screen reader only text */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    /* Scrollbar Style */

    body::-webkit-scrollbar {
        width: 2rem;
    }

    html {
        scrollbar-width: thin;
        scrollbar-color: var(--yellow) var(--dark);
    }

    body::-webkit-scrollbar-track {
        background: var(--dark);
    }

    body::-webkit-scrollbar-thumb {
        background-color: var(--yellow) ;
        border-radius: 1rem;
        border: 3px solid var(--dark);
    }
  .cursor {
  display: inline-block;
  width: 15px;
  background-color: var(--white);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
    @media screen and (max-width: 760px) {
        html {
            font-size: 10px; /* Increase base size for mobile: 10px instead of 8px */
        }

        body {
            --font-size-h1: 4rem;
            --font-size-h2: 3rem;
            --font-size-h3: 2.4rem;
            --font-size-p: 2.2rem;
            --font-size-list: 2.2rem;
            font-size: 2.2rem; /* 22px on mobile (was 16px) */
            padding-right: 1rem;
            padding-left: 1rem;
            line-height: 1.6; /* Better readability on mobile */
        }

        /* Better touch targets for mobile */
        a, button, input, textarea {
            min-height: 44px; /* iOS recommended touch target */
        }

        /* Improve tap highlight */
        * {
            -webkit-tap-highlight-color: rgba(255, 221, 26, 0.3);
        }

        /* Prevent zoom on input focus for iOS */
        input[type="text"],
        input[type="email"],
        textarea {
            font-size: 16px; /* Prevents iOS zoom */
        }
    }

    /* Respect user's motion preferences */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }

    /* Code Block Copy Button */
    .code-block-wrapper {
        position: relative;
        margin-bottom: 2rem;
    }

    .copy-code-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--yellow);
        color: var(--black);
        font-family: 'Roboto Mono', monospace;
        font-size: 1.4rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: bold;
        opacity: 0;
        z-index: 10;
    }

    .code-block-wrapper:hover .copy-code-button {
        opacity: 1;
    }

    .copy-code-button:hover {
        background: var(--white);
        transform: scale(1.05);
        opacity: 1;
    }

    .copy-code-button:focus {
        outline: 2px solid var(--yellow);
        outline-offset: 2px;
        opacity: 1;
    }

    .copy-code-button.copied {
        background: var(--green);
        color: var(--white);
    }

    @media screen and (max-width: 760px) {
        .copy-code-button {
            display: none; /* Hide on mobile - covers code */
        }
    }

    /* Prism Line Numbers */
    pre[class*="language-"].line-numbers {
        position: relative;
        padding-left: 5em;
        counter-reset: linenumber;
`;

export default GlobalStyles;
