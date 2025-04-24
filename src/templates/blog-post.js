import React, { Suspense } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Bio from '../components/bio';
import SEO from '../components/SEO';

const Comments = React.lazy(() => import('../components/comments.js'));

const CommentStyles = styled.nav``;
const PostStyles = styled.nav`

h1 {
  color: var(--yellow);
}

h2 {

  color: var(--yellow);
  text-align: left;
}

h3 {
  color: var(--yellow);
  text-align: left;
}

h1:before {
  content: "# ";
}

h2:before {
  content: "## ";
}

h3:before {
  content: "### ";
}

time {
  text-align: center;
}

`;

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { previous, next } = data;

  return (
    <div location={location} title={siteTitle} className="item2">
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p style={{ textAlign: 'center' }}>
            Post Date: <time>{post.frontmatter.date}</time>
          </p>
          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            {post.frontmatter.tags.map(tag => (
              <Link
                key={tag}
                to={`/topics/${tag}/`}
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--yellow)',
                  color: 'var(--black)',
                  padding: '0.25rem 0.5rem',
                  margin: '0.5rem 0.5rem', // Increased margin for better spacing
                  borderRadius: '5px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>
        <PostStyles>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
        </PostStyles>
        <CommentStyles>
          <Suspense fallback={<div>Loading comments...</div>}>
            <Comments />
          </Suspense>
        </CommentStyles>
        <hr />
        <footer style={{ backgroundColor: 'var(--light-gray)', padding: '1rem', textAlign: 'center' }}>
          <p>
            <Bio />
            🐛 Found a typo or something that needs to be corrected?{' '}
            <a
              href={`https://github.com/jarossnd/jason-ross-dev-v2/tree/main/blog/posts/${post.fields.slug}index.md`}
              aria-label="Edit this post on GitHub"
              style={{ color: 'var(--yellow)', textDecoration: 'underline' }}
            >
              Edit on GitHub
            </a>
          </p>
        </footer>
      </article>
    </div>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
      fields {
        slug
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
