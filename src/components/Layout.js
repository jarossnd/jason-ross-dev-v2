import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';
import Footer from './Footer';
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
    h1 {
        font-size: 5rem;
        color: var(--yellow);
        text-align: center;
    }
    h2 {
        font-size: 4rem;
        color: var(--white);
        text-align: center;
    }
    h3 {
        font-size: 3rem;
        color: var(--white);
    }
    p {
        font-size: 3rem;
    }

    ul li {
        font-size: 3rem;
    }

    ol li {
        font-size: 3rem;
    }

    @media screen and (max-width: 760px) {
        h1 {
        font-size: 4rem;
        color: var(--yellow);
        text-align: center;
    }
    h2 {
        font-size: 3rem;
        color: var(--white);
        text-align: center;
    }
    h3 {
        font-size: 2rem;
        color: var(--white);
        text-align: center;
    }
    p {
        font-size: 2rem;
        line-height: 1.5;
    }

    ul li {
        font-size: 2rem;
    }

    ol li {
        font-size: 2rem;
    }

    @media screen and (max-width: 760px) {
        padding-right: 1rem;
        padding-left: 1rem;
    }

`;

export default function Layout({ children }) {
  return (
    <div>
      <GlobalStyles />
      <Nav />
      <ContentStyles>{children}</ContentStyles>
      <Footer />
    </div>
  );
}
