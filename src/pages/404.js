import React, { useState, useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const Container = styled.div`
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
`;

const ErrorHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
`;

const ASCIIArt = styled.pre`
  font-family: 'Roboto Mono', monospace;
  color: var(--yellow);
  font-size: var(--font-size-small);
  line-height: 1.2;
  margin: var(--spacing-xl) 0;
  overflow-x: auto;
  white-space: pre;
  
  @media screen and (max-width: 760px) {
    font-size: var(--font-size-tiny);
  }
`;

const TerminalPrompt = styled.div`
  background: var(--blue);
  border: 2px solid var(--yellow);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
  font-family: 'Roboto Mono', monospace;
`;

const PromptLine = styled.div`
  color: var(--grey);
  margin-bottom: var(--spacing-sm);
  
  .prompt {
    color: var(--yellow);
    margin-right: var(--spacing-xs);
  }
  
  .command {
    color: var(--white);
  }
  
  .error {
    color: #ff6b6b;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Section = styled.section`
  margin: var(--spacing-2xl) 0;
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-h3);
  color: var(--yellow);
  margin-bottom: var(--spacing-lg);
  font-family: 'Roboto Mono', monospace;
  
  &:before {
    content: '$ ';
    color: var(--grey);
  }
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const QuickLinkCard = styled(Link)`
  background: var(--blue);
  border: 2px solid var(--grey);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  
  &:hover {
    border-color: var(--yellow);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: var(--font-size-h2);
    margin-bottom: var(--spacing-sm);
  }
  
  .title {
    font-size: var(--font-size-h4);
    color: var(--yellow);
    margin-bottom: var(--spacing-xs);
    font-family: 'Roboto Mono', monospace;
  }
  
  .description {
    font-size: var(--font-size-small);
    color: var(--grey);
  }
`;

const SearchBox = styled.div`
  background: var(--blue);
  border: 2px solid var(--yellow);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const SearchButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--yellow);
  color: var(--dark);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-p);
  font-weight: bold;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 221, 26, 0.3);
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const MiniPostCard = styled(Link)`
  background: var(--blue);
  border: 2px solid var(--grey);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  text-decoration: none;
  transition: all var(--transition-normal);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    border-color: var(--yellow);
    transform: translateX(4px);
  }
  
  .post-title {
    color: var(--white);
    font-size: var(--font-size-p);
  }
  
  .post-date {
    color: var(--grey);
    font-size: var(--font-size-small);
    font-family: 'Roboto Mono', monospace;
  }
`;

const TopicTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const TopicTag = styled(Link)`
  background: var(--blue);
  border: 2px solid var(--grey);
  color: var(--yellow);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  text-decoration: none;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--yellow);
    color: var(--dark);
    transform: translateY(-2px);
    border-color: var(--yellow);
  }
`;

const EasterEgg = styled.div`
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--dark);
  border: 1px dashed var(--grey);
  border-radius: var(--radius-md);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-tiny);
  color: var(--grey);
  text-align: center;
  opacity: 0.5;
  
  &:hover {
    opacity: 1;
  }
  
  kbd {
    background: var(--blue);
    border: 1px solid var(--yellow);
    border-radius: 3px;
    padding: 2px 6px;
    color: var(--yellow);
    margin: 0 2px;
  }
`;

export default function FourOhFourPage({ data }) {
  const recentPosts = data?.allMarkdownRemark?.nodes || [];
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  useEffect(() => {
    // Konami code easter egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowEasterEgg(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="item1">
      <Container>
        <ErrorHeader>
          <h1>404 - Page Not Found</h1>
          <ASCIIArt>{`
  _  _    ___  _  _   
 | || |  / _ \\| || |  
 | || |_| | | | || |_ 
 |__   _| |_| |__   _|
    |_|  \\___/   |_|  
                      
 ERROR: File not found
`}</ASCIIArt>
        </ErrorHeader>

        <TerminalPrompt>
          <PromptLine>
            <span className="prompt">$</span>
            <span className="command">cat /var/log/errors.log</span>
          </PromptLine>
          <PromptLine className="error">
            [ERROR] HTTP 404: The requested URL was not found on this server.
          </PromptLine>
          <PromptLine>
            Possible causes:
          </PromptLine>
          <PromptLine>• Mistyped URL</PromptLine>
          <PromptLine>• Broken link from another site</PromptLine>
          <PromptLine>• Page moved or deleted</PromptLine>
          <PromptLine>• You traveled back in time (unlikely)</PromptLine>
        </TerminalPrompt>

        <SearchBox>
          <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--grey)' }}>
            Can't find what you're looking for? Try searching:
          </p>
          <SearchButton to="/search">
            🔍 Search All Posts
          </SearchButton>
        </SearchBox>

        <Section>
          <SectionTitle>Quick Navigation</SectionTitle>
          <QuickLinks>
            <QuickLinkCard to="/">
              <span className="icon">🏠</span>
              <div className="title">Home</div>
              <div className="description">Back to the main page</div>
            </QuickLinkCard>
            
            <QuickLinkCard to="/posts">
              <span className="icon">📝</span>
              <div className="title">All Posts</div>
              <div className="description">Browse all blog posts</div>
            </QuickLinkCard>
            
            <QuickLinkCard to="/topics">
              <span className="icon">🏷️</span>
              <div className="title">Topics</div>
              <div className="description">Explore by category</div>
            </QuickLinkCard>
            
            <QuickLinkCard to="/about">
              <span className="icon">👤</span>
              <div className="title">About</div>
              <div className="description">Learn more about me</div>
            </QuickLinkCard>
          </QuickLinks>
        </Section>

        {recentPosts.length > 0 && (
          <Section>
            <SectionTitle>Recent Posts</SectionTitle>
            <PostList>
              {recentPosts.map((post) => (
                <MiniPostCard key={post.fields.slug} to={post.fields.slug}>
                  <span className="post-title">{post.frontmatter.title}</span>
                  <span className="post-date">{post.frontmatter.date}</span>
                </MiniPostCard>
              ))}
            </PostList>
          </Section>
        )}

        <Section>
          <SectionTitle>Popular Topics</SectionTitle>
          <TopicTags>
            <TopicTag to="/topics/linux">linux</TopicTag>
            <TopicTag to="/topics/gatsby">gatsby</TopicTag>
            <TopicTag to="/topics/sharepoint">sharepoint</TopicTag>
            <TopicTag to="/topics/windows">windows</TopicTag>
            <TopicTag to="/topics/arch">arch</TopicTag>
            <TopicTag to="/topics/powershell">powershell</TopicTag>
            <TopicTag to="/topics/javascript">javascript</TopicTag>
          </TopicTags>
        </Section>

        <EasterEgg>
          <div>💡 Tip: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette</div>
          {showEasterEgg && (
            <>
              <br /><br />
              🎉 <strong style={{ color: 'var(--yellow)' }}>KONAMI CODE ACTIVATED!</strong> 🎉
              <br />
              You found the secret! You're clearly a person of culture.
            </>
          )}
        </EasterEgg>
      </Container>
    </div>
  );
}

export const Head = () => <SEO title="404 - Page Not Found" />;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      limit: 5
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: {
          status: { nin: ["draft", "archived"] }
        }
      }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "MMM DD, YYYY")
        }
      }
    }
  }
`;
