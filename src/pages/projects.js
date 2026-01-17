import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';

const ProjectsStyles = styled.div`
  h2 {
    margin: 0px;
  }

  ul {
    list-style-type: none;
  }

  .container {
    border: var(--border-width) solid var(--black);
    border-radius: var(--radius-md);
    font-size: var(--font-size-p);
    text-decoration: none;
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--blue);
  }

  @media screen and (max-width: 760px) {
    .container {
      border: var(--border-width) solid var(--black);
      border-radius: var(--radius-md);
      font-size: var(--font-size-body);
      text-decoration: none;
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-sm);
      background-color: var(--blue);
    }
    ul {
      padding-left: var(--spacing-lg);
    }

    ul li {
      padding-left: 0px;
      position: unset;
    }
  }
`;

export default function ProjectsPage() {
  return (
    <>
      <div className="item1">
        <h1>Projects</h1>
        <h2>Here are a list of my projects...</h2>
        <p>Below are a list of my projects that I have done over the years.</p>
        <ProjectsStyles>
          <div className="container">
            <h2>Jason's Cookbook</h2>
            <ul>
              <li>🚀 Project Name: Jason's Cookbook</li>
              <li>📅 Project Date: 4/25/2022</li>
              <li>📃 Description: A simple recipe website</li>
              <li>🧑‍💻 Stack: Gatsby, Javascript, CSS</li>
              <li>📎 Link: www.jason.cooking</li>
            </ul>
          </div>
        </ProjectsStyles>
      </div>
    </>
  );
}

export const Head = () => <SEO title="Projects" />;
