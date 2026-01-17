import React, { Suspense } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Bio from '../components/bio';
import SEO from '../components/SEO';
import PostDisclaimer from '../components/PostDisclaimer';
import Changelog from '../components/Changelog';

const Comments = React.lazy(() => import('../components/comments.js'));

const CommentStyles = styled.nav``;

const PostHeader = styled.header`
  .post-date {
    text-align: center;
  }
  
  .tags-container {
    text-align: center;
    margin: var(--spacing-sm) 0;
  }
`;

const GitLogMeta = styled.div`
  background-color: var(--dark);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  
  .meta-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .meta-label {
    color: var(--yellow);
    font-weight: bold;
  }
  
  .meta-value {
    color: var(--grey);
  }
  
  .commit-button {
    background: none;
    border: none;
    color: var(--grey);
    font-family: 'Roboto Mono', monospace;
    font-size: inherit;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: color var(--transition-fast) var(--easing-standard);
    
    &:hover {
      color: var(--yellow);
    }
  }
  
  .settings-button {
    background: none;
    border: 2px solid var(--yellow);
    border-radius: 3px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: relative;
    transition: all var(--transition-fast) var(--easing-standard);
    margin-left: var(--spacing-sm);
    
    &.active {
      background-color: var(--yellow);
    }
    
    &.active::after {
      content: '✓';
      position: absolute;
      color: var(--dark);
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
    }
    
    &:hover {
      box-shadow: 0 0 8px rgba(255, 221, 26, 0.3);
    }
  }
  
  .settings-label {
    color: var(--yellow);
    font-size: var(--font-size-small);
    cursor: pointer;
    transition: color var(--transition-fast) var(--easing-standard);
    
    &:hover {
      color: var(--grey);
    }
  }
  
  @media screen and (max-width: 760px) {
    padding: var(--spacing-sm);
    font-size: var(--font-size-meta);
    
    .meta-line {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs);
    }
    
    .settings-label {
      font-size: var(--font-size-meta);
    }
  }
`;

const TagsLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  margin: var(--spacing-md) 0;
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    justify-content: center;
  }
`;

const TagLink = styled(Link)`
  display: inline-block;
  background-color: var(--yellow);
  color: var(--black);
  padding: var(--spacing-xs) var(--spacing-sm);
  margin: var(--spacing-xs) var(--spacing-xs);
  border-radius: var(--radius-sm);
  text-decoration: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-normal) var(--easing-standard), 
              box-shadow var(--transition-normal) var(--easing-standard);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 760px) {
    min-height: unset; /* Override global min-height for tags */
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-meta);
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

${props => props.$showHashes && `
  h1:before {
    content: "# ";
  }

  h2:before {
    content: "## ";
  }

  h3:before {
    content: "### ";
  }
`}

time {
  text-align: center;
}

@media screen and (max-width: 760px) {
  p, li {
    font-size: var(--font-size-body); /* Match body font size */
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
    font-size: var(--font-size-small);
    word-break: break-word;
  }

  pre code {
    font-size: var(--font-size-meta);
  }
}

`;

const PostFooter = styled.footer`
  background-color: var(--light-gray);
  padding: var(--spacing-sm);
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
  const [changelogOpen, setChangelogOpen] = React.useState(false);
  const [showMarkdownHashes, setShowMarkdownHashes] = React.useState(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showMarkdownHashes');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });

  const handleToggleHashes = () => {
    const newValue = !showMarkdownHashes;
    setShowMarkdownHashes(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('showMarkdownHashes', newValue);
    }
  };

  return (
    <div location={location} title={siteTitle} className="item2">
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <PostHeader>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <GitLogMeta>
            <div className="meta-line">
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <time className="meta-value">{post.frontmatter.date}</time>
              </div>
              <div className="meta-item">
                <span className="meta-label">Author:</span>
                <span className="meta-value">Jason Ross &lt;jason@localhost&gt;</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Commit:</span>
                <button 
                  className="commit-button"
                  onClick={() => setChangelogOpen(!changelogOpen)}
                  aria-expanded={changelogOpen}
                  aria-label="Toggle changelog"
                >
                  {post.id.substring(0, 7)} {changelogOpen ? '▼' : '▶'}
                </button>
              </div>
              <div className="meta-item">
                <span 
                  className="settings-label"
                  onClick={handleToggleHashes}
                >
                  Markdown:
                </span>
                <button 
                  className={`settings-button ${showMarkdownHashes ? 'active' : ''}`}
                  onClick={handleToggleHashes}
                  aria-label="Toggle markdown header hashes"
                  aria-pressed={showMarkdownHashes}
                />
              </div>
            </div>
          </GitLogMeta>
        </PostHeader>
        {changelogOpen && <Changelog slug={post.fields.slug} commits={post.fields.gitCommits || []} />}
        <TagsLine>
          <div className="tags-list">
            {post.frontmatter.tags.map(tag => (
              <TagLink
                key={tag}
                to={`/topics/${tag}/`}
              >
                #{tag}
              </TagLink>
            ))}
          </div>
        </TagsLine>
        <PostDisclaimer 
          postDate={post.frontmatter.date}
          updatedArticle={post.frontmatter.updatedArticle}
          updatedArticleTitle={data.updatedPost?.frontmatter?.title}
        />
        <PostStyles $showHashes={showMarkdownHashes}>
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
            <span aria-hidden="true">🐛</span> Found a typo or something that needs to be corrected?{' '}
            <a
              href={`https://github.com/jarossnd/jason-ross-dev-v2/tree/main/blog/posts/${post.fields.slug}index.md`}
              aria-label="Edit this post on GitHub (opens in new window)"
              target="_blank"
              rel="noopener noreferrer"
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
        gitCommits {
          hash
          date
          message
        }
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
