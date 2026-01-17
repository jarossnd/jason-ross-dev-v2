import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
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

const TypingEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true); // State to control cursor visibility

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => text.slice(0, index + 1)); // Use slice to ensure correct substring
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    // Stop the cursor blinking after 5 seconds (reduced from 10)
    const cursorTimeout = setTimeout(() => {
      setShowCursor(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(cursorTimeout);
    }; // Cleanup intervals and timeouts on unmount
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {showCursor && <span className="cursor">|</span>}
    </span>
  );
};

const IndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>No recent posts found.</p>
      </Layout>
    );
  }

  return (
    <div location={location} title={siteTitle} className="item2">
      <h1>Welcome</h1>
      <h2><TypingEffect text="👋 Hello, my name is Jason " speed={100} /></h2>
      <p>
        Welcome to my corner on the internet! I talk about technology and other
        topics on my blog, and you will find other useful pages on this site.
        Sometimes I post videos on my YouTube channel found{' '}
        <a href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g" aria-label="Jason's YouTube Channel">
          here
        </a>
        . I typically write about Linux, utilities, servers, web dev, and
        occasionally some off topics. Most recently I have been getting in shape and participating in running events.
      </p>
      <h2>Latest Posts</h2>
      <BlogStyles>
        <ol style={{ listStyle: `none` }}>
          {posts?.map((post) => (
            <PostCard key={post.fields.slug} post={post} />
          ))}
        </ol>
      </BlogStyles>
    </div>
  );
};

export default IndexPage;

export const Head = () => <SEO title="Technology Enthusiast" />;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 3, sort: { frontmatter: { date: DESC } }) {
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
