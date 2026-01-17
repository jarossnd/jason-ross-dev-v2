import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';
import PostCard from '../components/PostCard';

const BlogStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0px;
  margin: 0px;
  text-align: center;

    ol {
    padding: 0px;
    margin: 0px;
    text-align: center;
  }
`;

const TopicStyles = styled.div`
  border: 3px solid transparent;
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--blue);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  h3 {
    margin: 0px;
  }

  .post-link {
    text-decoration: none;
    color: var(--yellow);
    transition: color 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    border-color: var(--yellow); /* Add yellow border on hover */
  }

  .post-link:hover {
    color: var(--white);
  }
`;

const Tags = ({ pageContext, data }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagTitle = `${tag}`;
  const tagCount = `${totalCount}`;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with "${tag}"`;
  return (
    <>
      <div className="item1">
        <h1>Topics: {tagTitle}</h1>
        <p>
          We found <strong>{tagCount}</strong> posts on the topic of{' '}
          <strong>{tagTitle}</strong>. View posts below or see{' '}
          <Link to="/topics">all topics</Link>.
        </p>

        <div className="container">
          <BlogStyles>
            <ol style={{ listStyle: `none` }}>
              {posts?.map((post) => (
                <PostCard key={post.fields.slug} post={post} />
              ))}
            </ol>
          </BlogStyles>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/topics" style={{ fontSize: '1.5rem', color: 'var(--yellow)' }}>
            Explore All Topics →
          </Link>
        </p>

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

export const Head = ({ pageContext }) => <SEO title={pageContext.tag} />;
export const pageQuery = graphql`
  query ($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: { 
        frontmatter: { 
          tags: { in: [$tag] }
          status: { nin: ["draft", "archived"] }
        } 
      }
    ) {
      totalCount
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
        timeToRead
      }
    }
  }
`;
