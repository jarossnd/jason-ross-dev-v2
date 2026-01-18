import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const FeedHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const TerminalCommand = styled.h2`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-p);
  margin-bottom: var(--spacing-md);
  
  span {
    color: var(--yellow);
  }
`;

const FeedGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
`;

const PostCard = styled.article`
  background: var(--dark);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius-sm);
  padding: var(--spacing-lg);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateX(10px);
    box-shadow: 0 0 20px rgba(255, 221, 26, 0.1);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--yellow);
`;

const PostMeta = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-weight: bold;
  font-size: var(--font-size-small);
`;

const PostDate = styled.time`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-meta);
  opacity: 0.7;
`;

const PostContent = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  font-size: var(--font-size-small);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  
  p {
    margin: var(--spacing-sm) 0;
  }
  
  a {
    color: var(--yellow);
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  .invisible {
    display: none;
  }
  
  .ellipsis::after {
    content: '…';
  }
`;

const MediaGrid = styled.div`
  display: grid;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
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
  height: ${props => props.count === 1 ? 'auto' : '200px'};
  max-height: ${props => props.count === 1 ? '500px' : '200px'};
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

const SensitiveWarning = styled.div`
  background: var(--blue);
  border: 2px solid var(--yellow);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  text-align: center;
  
  button {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-md);
    background: var(--yellow);
    color: var(--blue);
    border: none;
    border-radius: var(--radius-sm);
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(255, 221, 26, 0.5);
    }
  }
`;

const PostStats = styled.div`
  display: flex;
  gap: var(--spacing-md);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  color: var(--grey);
  opacity: 0.7;
  margin-bottom: var(--spacing-sm);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const PostLink = styled.a`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-size: var(--font-size-small);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  border-bottom: none;
  
  &:hover {
    text-decoration: underline;
    border-bottom: none;
  }
`;

const LoadingMessage = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--grey);
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--dark);
  border-radius: var(--radius-md);
`;

const ErrorMessage = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  padding: var(--spacing-lg);
  background: var(--dark);
  border-left: 3px solid var(--yellow);
  border-radius: var(--radius-sm);
`;

const ProfileLink = styled.a`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`;

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSensitive, setShowSensitive] = useState({});
  
  const mastodonInstance = 'mastodon.social';
  const username = 'jrossnd';
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // First, get the user ID
        const accountResponse = await fetch(
          `https://${mastodonInstance}/api/v1/accounts/lookup?acct=${username}`
        );
        
        if (!accountResponse.ok) {
          throw new Error('Failed to fetch account info');
        }
        
        const accountData = await accountResponse.json();
        const accountId = accountData.id;
        
        // Then fetch the posts
        const postsResponse = await fetch(
          `https://${mastodonInstance}/api/v1/accounts/${accountId}/statuses?limit=20&exclude_replies=true`
        );
        
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const postsData = await postsResponse.json();
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };
  
  const toggleSensitive = (postId) => {
    setShowSensitive(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  const renderMedia = (post) => {
    if (!post.media_attachments || post.media_attachments.length === 0) {
      return null;
    }
    
    const images = post.media_attachments.filter(media => media.type === 'image');
    if (images.length === 0) return null;
    
    // Check if post is marked sensitive and hasn't been revealed
    if (post.sensitive && !showSensitive[post.id]) {
      return (
        <SensitiveWarning>
          ⚠️ Sensitive Content (Click to reveal)
          <br />
          <button onClick={() => toggleSensitive(post.id)}>
            Show Media
          </button>
        </SensitiveWarning>
      );
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
  
  return (
    <>
      <div className="item1">
        <h1>Feed</h1>
        
        <FeedHeader>
          <TerminalCommand>
            <span>$</span> curl https://{mastodonInstance}/api/v1/accounts/@{username}/statuses
          </TerminalCommand>
          <p>
            Latest posts from my Mastodon account at{' '}
            <ProfileLink 
              href={`https://${mastodonInstance}/@${username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{username}@{mastodonInstance}
            </ProfileLink>
          </p>
        </FeedHeader>
        
        {loading && (
          <LoadingMessage>Loading posts...</LoadingMessage>
        )}
        
        {error && (
          <ErrorMessage>
            Error loading posts: {error}
          </ErrorMessage>
        )}
        
        {!loading && !error && posts.length === 0 && (
          <LoadingMessage>No posts found.</LoadingMessage>
        )}
        
        {!loading && !error && posts.length > 0 && (
          <FeedGrid>
            {posts.map((post) => (
              <PostCard key={post.id}>
                <PostHeader>
                  <Avatar 
                    src={post.account.avatar} 
                    alt={post.account.display_name}
                  />
                  <PostMeta>
                    <AuthorName>
                      {post.account.display_name || post.account.username}
                    </AuthorName>
                    <PostDate dateTime={post.created_at}>
                      {formatDate(post.created_at)}
                    </PostDate>
                  </PostMeta>
                </PostHeader>
                
                <PostContent 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {renderMedia(post)}
                
                <PostStats>
                  <Stat>💬 {post.replies_count}</Stat>
                  <Stat>🔁 {post.reblogs_count}</Stat>
                  <Stat>⭐ {post.favourites_count}</Stat>
                </PostStats>
                
                <PostLink 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on Mastodon →
                </PostLink>
              </PostCard>
            ))}
          </FeedGrid>
        )}
      </div>
    </>
  );
}

export const Head = () => <SEO title="Feed" />;
