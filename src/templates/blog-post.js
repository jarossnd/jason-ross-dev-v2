import React, { Suspense } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Bio from '../components/bio';
import SEO from '../components/SEO';

const Comments = React.lazy(() => import('../components/comments.js'));

const CommentStyles = styled.nav``;

const PostHeader = styled.header`
  .post-date {
    text-align: center;
  }
  
  .tags-container {
    text-align: center;
    margin: 1rem 0;
  }
`;

const TagLink = styled(Link)`
  display: inline-block;
  background-color: var(--yellow);
  color: var(--black);
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0.5rem;
  border-radius: 5px;
  text-decoration: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

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

const PostFooter = styled.footer`
  background-color: var(--light-gray);
  padding: 1rem;
  text-align: center;

  a {
    color: var(--yellow);
    text-decoration: underline;
  }
`;

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { previous, next } = data;

  return (
    <div location={location} title={siteTitle} className="item2">
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <PostHeader>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p className="post-date">
            Post Date: <time>{post.frontmatter.date}</time>
          </p>
          <div className="tags-container">
            {post.frontmatter.tags.map(tag => (
              <TagLink
                key={tag}
                to={`/topics/${tag}/`}
              >
                #{tag}
              </TagLink>
            ))}
          </div>
        </PostHeader>
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
        <PostFooter>
          <p>
            <Bio />
            🐛 Found a typo or something that needs to be corrected?{' '}
            <a
              href={`https://github.com/jarossnd/jason-ross-dev-v2/tree/main/blog/posts/${post.fields.slug}index.md`}
              aria-label="Edit this post on GitHub"
            >
              Edit on GitHub
            </a>
          </p>
        </PostFooter>
      </article>
    </div>
  );
};

export default BlogPostTemplate;

export const Head = ({ data }) => (
  <SEO
    title={data.markdownRemark.frontmatter.title}
    description={data.markdownRemark.frontmatter.description || data.markdownRemark.excerpt}
  />
);

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
