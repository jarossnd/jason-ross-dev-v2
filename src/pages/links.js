import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';
import ContentContainer from '../components/ContentContainer';

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

  @media screen and (max-width: 760px) {
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
          <ContentContainer borderColor="var(--black)">
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
          </ContentContainer>
          <ContentContainer borderColor="var(--black)">
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
          </ContentContainer>
          <ContentContainer borderColor="var(--black)">
            <h2>Vim</h2>
            <ul>
              <li>
                <a
                  href="https://vim-adventures.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vim Adventures
                </a>
              </li>
              <li>
                <a
                  href="https://www.openvim.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Vim
                </a>
              </li>
              <li>
                <a
                  href="https://neovim.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Neovim
                </a>
              </li>
            </ul>
          </ContentContainer>
        </LinksStyles>
      </div>
    </>
  );
}
