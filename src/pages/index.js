import React, { useState, useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

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

const PostStyles = styled.div`
  border: 2px solid transparent;
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--blue);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    border-color: var(--yellow);
  }

  h3 {
    margin: 0px;
    text-align: center;
    color: var(--yellow);
    font-size: var(--font-size-h3);
  }

  .post-link {
    text-decoration: none;
    color: var(--yellow);
    transition: color 0.3s ease;
  }

  .post-link:hover {
    color: var(--white);
  }

  .post-info {
    color: var(--grey);
  }

  p {
    color: var(--white);
  }

  a:hover {
    border-bottom: 3px solid var(--yellow);
    border-color: var(--yellow);
    border-bottom-color: var(--yellow);
  }
`;

const Post = ({ post }) => {
  const title = post.frontmatter.title || post.fields.slug;
  return (
    <li key={post.fields.slug}>
      <Link to={post.fields.slug} itemProp="url" className="post-link">
        <article
          className="post-list-item"
          itemScope
          itemType="http://schema.org/Article"
        >
          <PostStyles>
            <h3>
              <span itemProp="headline">{title}</span>
            </h3>
            <p className="post-info" style={{ fontSize: `16px` }}>
              <span>📅 {post.frontmatter.date}</span> |{' '}
              <span>🕑 {post.timeToRead} min</span>
            </p>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.frontmatter.description || post.excerpt,
                }}
                itemProp="description"
              />
            </section>
          </PostStyles>
        </article>
      </Link>
    </li>
  );
};

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

    // Stop the cursor blinking after 10 seconds
    const cursorTimeout = setTimeout(() => {
      setShowCursor(false);
    }, 10000);

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
        <a href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g">
          here
        </a>
        . I typically write about Linux, utilities, servers, web dev, and
        occasionally some off topics. Most recently I have been getting in shape and participating in running events.
      </p>
      <h2>Latest Posts</h2>
      <BlogStyles>
        <ol style={{ listStyle: `none` }}>
          {posts?.map((post) => (
            <Post key={post.fields.slug} post={post} />
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
