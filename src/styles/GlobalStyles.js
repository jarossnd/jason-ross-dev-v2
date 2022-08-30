import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root {
        --red: #FF4949;
        --black: #2E2E2E;
        --yellow: #ffdd1a;
        --white: #ffffff;
        --grey: #efefef;
        --dark: #202030;
        --blue: #0E0F19;
        --orange: #FE7F2D;
        --purple: #C04ABC;
        --green: #639A88;
    }

    html {
        font-size: 8px;
        background-color: var(--blue);
    }

    body {
        font-family: 'Roboto Mono', 'Courier New', Courier, monospace;
        font-size: 2rem;
        color: var(--white);
        line-height: 1.5;
        padding-right: 2rem;
        padding-left: 2rem;
        overflow-y: scroll;
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
    @media screen and (max-width: 760px) {
        body {
            padding-right: 1rem;
            padding-left: 1rem;
        }
    }
`;

export default GlobalStyles;
