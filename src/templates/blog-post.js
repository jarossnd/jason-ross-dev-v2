import React, { Suspense } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Bio from '../components/bio';
import SEO from '../components/SEO';

const Comments = React.lazy(() => import('../components/comments.js'));

const CommentStyles = styled.nav``;
const PostStyles = styled.nav`

h1 {
  text-align: left;
  color: var(--yellow);
}

  h2 {
    text-align: left;
    color: var(--yellow);
  }

  h3 {
    text-align: left;
    color: var(--yellow);
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
          <p>Post Date: <time>{post.frontmatter.date}</time></p>
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
        <footer>
          <p style={{ textAlign: `center;` }}>
            <Bio />
            🐛 Found a typo or something that needs to be corrected?{' '}
            <a
              href={`https://github.com/jarossnd/jason-ross-dev-v2/tree/main/blog/posts/${post.fields.slug}index.md`}
              aria-label="Edit this post on GitHub"
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
