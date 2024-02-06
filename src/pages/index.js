import React from 'react';
import PropTypes from 'prop-types';
// Utilities
import kebabCase from 'lodash/kebabCase';
// Components
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const TopicStyles = styled.div`
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
      column-count: 1;
      text-align: center;
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

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <>
    <SEO title="Technology Enthusiast" />
    <div className="item1">
      <h1>Welcome</h1>
      <h2>Hello, my name is Jason 👋</h2>
      <p>
        Welcome to my corner on the internet! I talk about technology and other
        topics on my blog, and you will find other useful pages on this site.
        Sometimes I post videos on my YouTube channel found{' '}
        <a href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g">
          here
        </a>
        . I typically write about Linux, utilities, servers, web dev, and
        occasionally some off topics. 
      </p>
      <TopicStyles>
        <div className="container">
          <h2>Topics</h2>
          <ul>
            {group.map((tag) => (
              <li key={tag.fieldValue}>
                <Link to={`/topics/${kebabCase(tag.fieldValue)}/`}>
                  {tag.fieldValue}</Link>
                  {' '}
                ({tag.totalCount})
              </li>
            ))}
          </ul>
        </div>
      </TopicStyles>
    </div>
  </>
);
TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
};
export default TagsPage;
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
