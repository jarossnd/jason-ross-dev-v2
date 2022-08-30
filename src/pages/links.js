import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';

const LinksStyles = styled.div`
  ul {
    list-style-type: none;

    -moz-column-count: 3;
    -moz-column-gap: 20px;
    -webkit-column-count: 3;
    -webkit-column-gap: 20px;
    column-count: 3;
    column-gap: 20px;
  }
  ul li {
    padding-left: 30px;
  }

  ul li:before {
    margin: 0 0 0 -34px;
    text-align: right;
    width: 2em;
    display: inline-block;
    position: absolute;
    height: 100%;
  }

  h2 {
    margin: 0px;
  }

  .container {
    border: 3px solid var(--black);
    border-radius: 15px;
    font-size: 3rem;
    text-decoration: none;
    margin-bottom: 20px;
    padding: 2rem;
    background-color: var(--blue);
  }

  @media screen and (max-width: 760px) {
    .container {
      border: 3px solid var(--black);
      border-radius: 15px;
      font-size: 2rem;
      text-decoration: none;
      margin-bottom: 10px;
      padding: 1rem;
      background-color: var(--blue);
    }
    ul {
      column-count: 3;
      padding-left: 2rem;
    }

    ul li {
      padding-left: 0px;
      position: unset;
    }

    ul li:before {
      margin: 0 0 0 -34px;
      text-align: right;
      width: 2em;
      display: inline-block;
      position: absolute;
      height: 100%;
    }
  }
  }
`;

export default function ProjectsPage() {
  return (
    <>
      <SEO title="Links" />
      <div className="item1">
        <h1>Links</h1>
        <p>
          This page contains some useful links that I frequently visit or find
          useful. I just created this page so it will take time to fully
          populate this page.
        </p>
        <LinksStyles>
          <div className="container">
            <h2>My Links</h2>
            <ul>
              <li>
                <a
                  href="https://www.jasonross.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jason Ross Xyz
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/jarossnd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jason's GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube Channel
                </a>
              </li>
            </ul>
          </div>
          <div className="container">
            <h2>Linux</h2>
            <ul>
              <li>
                <a
                  href="https://aur.archlinux.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Arch AUR
                </a>
              </li>
              <li>
                <a
                  href="https://larbs.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Larbs
                </a>
              </li>
              <li>
                <a
                  href="https://suckless.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  suckless.org
                </a>
              </li>
            </ul>
          </div>
        </LinksStyles>
      </div>
    </>
  );
}
