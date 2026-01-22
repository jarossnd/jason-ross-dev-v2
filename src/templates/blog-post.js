import React, { Suspense, useEffect, useState } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Bio from '../components/bio';
import SEO from '../components/SEO';
import PostDisclaimer from '../components/PostDisclaimer';
import Changelog from '../components/Changelog';
import TableOfContents from '../components/TableOfContents';
import HeadingAnchor from '../components/HeadingAnchor';
import ImageLightbox from '../components/ImageLightbox';
import UpdatedArticleBadge from '../components/UpdatedArticleBadge';

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
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid rgba(255, 221, 26, 0.2);
`;

const FooterSection = styled.div`
  background-color: var(--dark);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  font-family: 'Roboto Mono', monospace;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FooterTitle = styled.h3`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-size: var(--font-size-small);
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterContent = styled.p`
  color: var(--grey);
  font-size: var(--font-size-small);
  line-height: 1.6;
  margin: 0;
  
  a {
    color: var(--yellow);
    text-decoration: none;
    border-bottom: 1px dotted var(--yellow);
    transition: all var(--transition-fast);
    
    &:hover {
      border-bottom-style: solid;
      opacity: 0.8;
    }
  }
  
  strong {
    color: var(--grey);
    font-weight: bold;
  }
`;

const EditButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--dark);
  color: var(--yellow);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 2px solid var(--yellow);
  text-decoration: none;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--yellow);
    color: var(--dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 221, 26, 0.3);
  }
  
  span {
    font-size: 1.2em;
  }
`;

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { previous, next } = data;
  const [changelogOpen, setChangelogOpen] = React.useState(false);
  const [headings, setHeadings] = useState([]);
  const [showMarkdownHashes, setShowMarkdownHashes] = React.useState(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showMarkdownHashes');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });

  // Extract headings from post HTML for table of contents
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const article = document.querySelector('article');
      if (article) {
        const headingElements = article.querySelectorAll('h2, h3');
        const tocHeadings = Array.from(headingElements).map((heading) => {
          // Add ID to heading if it doesn't have one
          if (!heading.id) {
            const id = heading.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            heading.id = id;
          }
          
          return {
            id: heading.id,
            text: heading.textContent,
            level: parseInt(heading.tagName.substring(1))
          };
        });
        setHeadings(tocHeadings);
      }
    }
  }, [post.html]);

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
        data-pagefind-body
      >
        <PostHeader>
          <h1 itemProp="headline" data-pagefind-meta="title">{post.frontmatter.title}</h1>
          <GitLogMeta data-pagefind-ignore>
            <div className="meta-line">
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <time className="meta-value" data-pagefind-meta="date">{post.frontmatter.date}</time>
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
        <TagsLine data-pagefind-ignore>
          <div className="tags-list">
            {post.frontmatter.tags.map(tag => (
              <TagLink
                key={tag}
                to={`/topics/${tag}/`}
                data-pagefind-meta={`tags`}
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
          data-pagefind-ignore
        />
        {post.frontmatter.updatedArticle && (
          <UpdatedArticleBadge 
            updatedDate={post.frontmatter.updatedArticle}
            updatedTitle={data.updatedPost?.frontmatter?.title}
            updatedSlug={data.updatedPost?.fields?.slug}
            data-pagefind-ignore
          />
        )}
        {headings.length > 0 && <TableOfContents headings={headings} data-pagefind-ignore />}
        <HeadingAnchor />
        <ImageLightbox />
        <PostStyles $showHashes={showMarkdownHashes}>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
        </PostStyles>
        <PostFooter data-pagefind-ignore>
          <FooterSection>
            <FooterTitle>About the Author</FooterTitle>
            <FooterContent>
              Written by <strong>Jason Ross</strong>. All opinions expressed here are my own and do not reflect the views of my employer.
            </FooterContent>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Found an Issue?</FooterTitle>
            <FooterContent>
              Spotted a typo, broken link, or technical error? Help improve this post by suggesting an edit.
            </FooterContent>
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <EditButton
                href={`https://github.com/jarossnd/jason-ross-dev-v2/tree/main/blog/posts/${post.fields.slug}index.md`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Edit this post on GitHub"
              >
                <span>✏️</span> Edit on GitHub
              </EditButton>
            </div>
          </FooterSection>
        </PostFooter>
        <CommentStyles data-pagefind-ignore>
          <Suspense fallback={<div>Loading comments...</div>}>
            <Comments />
          </Suspense>
        </CommentStyles>
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
