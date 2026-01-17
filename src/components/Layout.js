import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import Footer from './Footer';
import CodeCopyButton from './CodeCopyButton';
import CommandPalette from './CommandPalette';
import 'normalize.css';
import GlobalStyles from '../styles/GlobalStyles';

const ContentStyles = styled.div`

    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 15px;
    padding-left: 20px;
    margin-bottom: 5px;
    padding-right: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'top top'
    'middle middle'
    'bottom bottom';
    grid-gap: 20px;
    align-items: center;
    .item1 {
        grid-area: top;
        grid-column-start: 1;
        grid-column-end: span 2;
    }
    .item2 {
        grid-area: top;
        text-align: left;
    }
    .item3 {
        grid-area: middle;
        text-align: center;
    }
    .item4 {
        grid-area: bottom;
        text-align: center;
    }
    background: var(--dark);
    color: var(--white);

    @media screen and (max-width: 760px) {
        padding-right: 1rem;
        padding-left: 1rem;
    }

    h1 {
        font-size: var(--font-size-h1);
        color: var(--yellow);
        text-align: center;
    }
    h2 {
        font-size: var(--font-size-h2);
        color: var(--white);
        text-align: center;
    }
    h3 {
        font-size: var(--font-size-h3);
        color: var(--white);
    }
    p, ul li, ol li {
        font-size: var(--font-size-p);
    }

`;

export default function Layout({ children }) {
  return (
    <>
      <GlobalStyles />
      <CodeCopyButton />
      <CommandPalette />
      <a href="#main-content" style={{ 
        position: 'absolute', 
        left: '-10000px', 
        top: 'auto', 
        width: '1px', 
        height: '1px', 
        overflow: 'hidden',
        '&:focus': {
          position: 'static',
          width: 'auto',
          height: 'auto'
        }
      }}>
        Skip to main content
      </a>
      <Nav />
      <main id="main-content">
        <ContentStyles>{children}</ContentStyles>
      </main>
      <Footer />
    </>
  );
}
