import React, { Suspense } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Bio from '../components/bio';
import SEO from '../components/SEO';
import PostDisclaimer from '../components/PostDisclaimer';

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

  @media screen and (max-width: 760px) {
    min-height: unset; /* Override global min-height for tags */
    padding: 0.5rem 1rem;
    font-size: 1.6rem;
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

@media screen and (max-width: 760px) {
  p, li {
    font-size: 2.2rem; /* Match body font size */
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  /* Better spacing for lists on mobile */
  ul, ol {
    padding-left: 2rem;
    margin-bottom: 2rem;
  }

  li {
    margin-bottom: 1rem;
  }

  /* Code blocks more readable on mobile */
  code {
    font-size: 1.8rem;
    word-break: break-word;
  }

  pre code {
    font-size: 1.6rem;
  }
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
        <PostDisclaimer 
          postDate={post.frontmatter.date}
          updatedArticle={post.frontmatter.updatedArticle}
          updatedArticleTitle={data.updatedPost?.frontmatter?.title}
        />
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
          <Bio />
          <p>
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

export const Head = ({ data, location }) => {
  const post = data.markdownRemark;
  const featuredImage = post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData?.images?.fallback?.src;
  const imageUrl = featuredImage ? `${data.site.siteMetadata.siteUrl}${featuredImage}` : undefined;

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        location={location}
        image={imageUrl}
        article={true}
      />
      {/* Article-specific Open Graph */}
      <meta property="article:published_time" content={new Date(post.frontmatter.date).toISOString()} />
      <meta property="article:author" content="Jason Ross" />
      {post.frontmatter.tags && post.frontmatter.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Enhanced Structured Data for BlogPosting */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.frontmatter.title,
          description: post.frontmatter.description || post.excerpt,
          image: imageUrl,
          datePublished: new Date(post.frontmatter.date).toISOString(),
          dateModified: new Date(post.frontmatter.date).toISOString(),
          author: {
            "@type": "Person",
            name: "Jason Ross",
            url: data.site.siteMetadata.siteUrl,
          },
          publisher: {
            "@type": "Person",
            name: "Jason Ross",
            url: data.site.siteMetadata.siteUrl,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": location.href,
          },
          keywords: post.frontmatter.tags?.join(", "),
        })}
      </script>
      
      {/* Breadcrumb Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: data.site.siteMetadata.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${data.site.siteMetadata.siteUrl}/posts`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.frontmatter.title,
              item: location.href,
            },
          ],
        })}
      </script>
    </>
  );
};

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
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
        status
        updatedArticle
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 1200, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
      fields {
        slug
      }
    }
    updatedPost: markdownRemark(
      fields: { slug: { eq: $id } }
      frontmatter: { updatedArticle: { ne: null } }
    ) {
      frontmatter {
        title
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
