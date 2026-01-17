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
  gap: 2rem;
  margin: 4rem 0;
  flex-wrap: wrap;
  font-family: 'Roboto Mono', monospace;

  button {
    background-color: var(--blue);
    color: var(--yellow);
    border: 3px solid transparent;
    padding: 1.5rem 3rem;
    border-radius: 15px;
    cursor: pointer;
    font-size: 3rem;
    font-family: 'Roboto Mono', monospace;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: var(--yellow);
      color: var(--black);
      border-color: var(--yellow);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      color: var(--grey);
    }
  }

  .page-info {
    color: var(--white);
    font-size: 3rem;
    margin: 0 1rem;
  }

  .page-numbers {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .page-number {
    background-color: var(--blue);
    color: var(--yellow);
    border: 3px solid transparent;
    padding: 1rem 2rem;
    border-radius: 15px;
    cursor: pointer;
    font-size: 3rem;
    font-family: 'Roboto Mono', monospace;
    transition: all 0.2s ease;
    min-width: 6rem;
    text-align: center;

    &:hover {
      background-color: var(--yellow);
      color: var(--black);
      border-color: var(--yellow);
      transform: translateY(-2px);
    }

    &.active {
      background-color: var(--yellow);
      color: var(--black);
      border-color: var(--yellow);
    }
  }

  .ellipsis {
    color: var(--yellow);
    font-size: 3rem;
    padding: 0 1rem;
  }

  @media screen and (max-width: 760px) {
    gap: 1rem;
    
    button {
      padding: 1rem 2rem;
      font-size: 2.5rem;
    }

    .page-number {
      padding: 0.75rem 1.5rem;
      font-size: 2.5rem;
      min-width: 5rem;
    }

    .page-info,
    .ellipsis {
      font-size: 2.5rem;
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

      <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '3rem', color: 'var(--white)' }}>
          Showing {indexOfFirstPost + 1} - {Math.min(indexOfLastPost, allPosts.length)} of {allPosts.length} posts
        </p>
      </div>

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
              <span key={`ellipsis-${index}`} className="ellipsis">...</span>
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
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: {
          status: { nin: ["draft", "archived"] }
        }
      }
    ) {
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
