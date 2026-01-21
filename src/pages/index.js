import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
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

const FeedSection = styled.div`
  margin-top: var(--spacing-2xl);
`;

const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
`;

const MastodonCard = styled.article`
  background: var(--blue);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 0 20px rgba(255, 221, 26, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
`;

const CardAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--yellow);
`;

const CardMeta = styled.div`
  flex: 1;
`;

const CardAuthor = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-weight: bold;
  font-size: var(--font-size-meta);
`;

const CardDate = styled.time`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-tiny);
  opacity: 0.7;
`;

const CardContent = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-small);
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
  
  p {
    margin: var(--spacing-xs) 0;
  }
  
  a {
    color: var(--yellow);
    text-decoration: underline;
  }
  
  .invisible {
    display: none;
  }
`;

const CardStats = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-tiny);
  color: var(--grey);
  opacity: 0.7;
`;

const MediaGrid = styled.div`
  display: grid;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  grid-template-columns: ${props => {
    const count = props.count || 1;
    if (count === 1) return '1fr';
    if (count === 2) return 'repeat(2, 1fr)';
    if (count === 3) return 'repeat(3, 1fr)';
    return 'repeat(2, 1fr)';
  }};
`;

const MediaImage = styled.img`
  width: 100%;
  height: ${props => props.count === 1 ? 'auto' : '150px'};
  max-height: ${props => props.count === 1 ? '300px' : '150px'};
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 2px solid var(--yellow);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(255, 221, 26, 0.3);
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-block;
  margin-top: var(--spacing-md);
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  text-decoration: none;
  font-weight: bold;
  border-bottom: none;
  
  &:hover {
    text-decoration: underline;
    border-bottom: none;
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
  const [mastodonPosts, setMastodonPosts] = useState([]);
  const [loadingMastodon, setLoadingMastodon] = useState(true);

  useEffect(() => {
    const fetchMastodonPosts = async () => {
      try {
        const mastodonInstance = 'mastodon.social';
        const username = 'jrossnd';
        
        // Get account info
        const accountResponse = await fetch(
          `https://${mastodonInstance}/api/v1/accounts/lookup?acct=${username}`
        );
        const accountData = await accountResponse.json();
        
        // Fetch posts
        const postsResponse = await fetch(
          `https://${mastodonInstance}/api/v1/accounts/${accountData.id}/statuses?limit=3&exclude_replies=true`
        );
        const postsData = await postsResponse.json();
        
        setMastodonPosts(postsData);
        setLoadingMastodon(false);
      } catch (err) {
        console.error('Error fetching Mastodon posts:', err);
        setLoadingMastodon(false);
      }
    };
    
    fetchMastodonPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const renderMedia = (post) => {
    if (!post.media_attachments || post.media_attachments.length === 0) {
      return null;
    }
    
    const images = post.media_attachments.filter(media => media.type === 'image');
    
    if (images.length === 0) {
      return null;
    }
    
    return (
      <MediaGrid count={images.length}>
        {images.map((media, index) => (
          <MediaImage
            key={media.id}
            src={media.preview_url || media.url}
            alt={media.description || `Image ${index + 1}`}
            count={images.length}
            onClick={() => window.open(media.url, '_blank')}
            loading="lazy"
          />
        ))}
      </MediaGrid>
    );
  };

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
      
      <FeedSection>
        <h2>Feed</h2>
        {loadingMastodon ? (
          <p style={{ fontFamily: 'Roboto Mono, monospace', color: 'var(--grey)' }}>
            Loading latest updates...
          </p>
        ) : mastodonPosts.length > 0 ? (
          <>
            <FeedGrid>
              {mastodonPosts.map((post) => (
                <MastodonCard key={post.id}>
                  <CardHeader>
                    <CardAvatar 
                      src={post.account.avatar} 
                      alt={post.account.display_name}
                    />
                    <CardMeta>
                      <CardAuthor>
                        {post.account.display_name || post.account.username}
                      </CardAuthor>
                      <CardDate dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                      </CardDate>
                    </CardMeta>
                  </CardHeader>
                  
                  <CardContent 
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  {renderMedia(post)}
                  
                  <CardStats>
                    <span>💬 {post.replies_count}</span>
                    <span>🔁 {post.reblogs_count}</span>
                    <span>⭐ {post.favourites_count}</span>
                  </CardStats>
                </MastodonCard>
              ))}
            </FeedGrid>
            <ViewAllLink to="/feed">View all updates →</ViewAllLink>
          </>
        ) : null}
      </FeedSection>
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
    allMarkdownRemark(
      limit: 3
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
