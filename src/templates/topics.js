import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const BlogStyles = styled.div`
  ol {
    padding: 0px;
    margin: 0px;
  }
`;

const TopicStyles = styled.div`
  border: 3px solid var(--black);
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--blue);
  h3 {
    margin: 0px;
  }
  .post-link {
    text-decoration: none;
    color: var(--yellow);
  }
  a:hover {
    border-bottom: 3px solid var(--yellow);
    border-color: var(--yellow);
    border-bottom-color: var(--yellow);
  }
`;

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagTitle = `${tag}`;
  const tagCount = `${totalCount}`;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`;
  return (
    <>
      <SEO title={tagTitle} />
      <div className="item1">
        <h1>Topics: {tagTitle}</h1>
        <p>
          We found <strong>{tagCount}</strong> posts on the topic of{' '}
          <strong>{tagTitle}</strong>. View posts below or see{' '}
          <Link to="/topics">all topics</Link>.
        </p>
        <BlogStyles>
          <div className="container">
            <ol style={{ listStyle: `none` }}>
              {edges.map(({ node }) => {
                const { slug } = node.fields;
                const { title } = node.frontmatter;
                const { date } = node.frontmatter;
                const { description } = node.frontmatter;
                return (
                  <TopicStyles>
                    <li key={slug}>
                      <h2>
                        <Link to={slug}>{title}</Link>
                      </h2>
                      <p>{date}</p>
                      <section>
                        <p>{description}</p>
                      </section>
                    </li>
                  </TopicStyles>
                );
              })}
            </ol>
          </div>
        </BlogStyles>
        {/*
              This links to a page that does not yet exist.
              You'll come back to it!
            */}
      </div>
    </>
  );
};
Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
};
export default Tags;
export const pageQuery = graphql`
  query ($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
