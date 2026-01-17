import React, { useState } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';
import PostCard from '../components/PostCard';

const BlogStyles = styled.div`
  ol {
    padding: 0px;
    margin: 0px;
    text-align: center;
  }

  div:hover {
    border: 2px solid var(--yellow);
  }
`;

const PaginationStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0;
  flex-wrap: wrap;

  button {
    background-color: var(--blue);
    color: var(--yellow);
    border: 2px solid var(--yellow);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: bold;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background-color: var(--yellow);
      color: var(--black);
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .page-info {
    color: var(--white);
    font-size: 1.6rem;
    font-weight: bold;
  }

  .page-numbers {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .page-number {
    background-color: var(--blue);
    color: var(--yellow);
    border: 2px solid var(--yellow);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.4rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--yellow);
      color: var(--black);
    }

    &.active {
      background-color: var(--yellow);
      color: var(--black);
      font-weight: bold;
    }
  }
`;

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const allPosts = data.allMarkdownRemark.nodes;
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  if (allPosts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          No posts found. Add markdown posts to "content/blog" (or the directory
          you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <div location={location} title={siteTitle} className="item2">
      <h1>Posts</h1>
      <p>
        My latest articles can be found below. If you want to view posts related
        to a specific topic, please see the <Link to="/topics">topics</Link>{' '}
        page. Get notified when I create new posts by subscribing to my RSS feed{' '}
        <a href="https://www.jasonross.dev/rss.xml">here</a>.
      </p>
      <BlogStyles>
        <ol style={{ listStyle: `none` }}>
          {currentPosts.map((post) => (
            <PostCard key={post.fields.slug} post={post} />
          ))}
        </ol>
      </BlogStyles>

      <PaginationStyles>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((number, index) => (
            number === '...' ? (
              <span key={`ellipsis-${index}`} className="page-info">...</span>
            ) : (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`page-number ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </PaginationStyles>

      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--grey)' }}>
        <p>
          Showing {indexOfFirstPost + 1} - {Math.min(indexOfLastPost, allPosts.length)} of {allPosts.length} posts
        </p>
      </div>
    </div>
  );
};

export default BlogIndex;

export const Head = () => <SEO title="Posts" />;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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
