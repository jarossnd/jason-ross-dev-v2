import React from 'react';
import styled from 'styled-components';

const ChangelogContainer = styled.div`
  margin: var(--spacing-md) 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
`;

const ChangelogContent = styled.div`
  background-color: rgba(32, 32, 48, 0.5);
  padding: var(--spacing-md);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);

  @media screen and (max-width: 760px) {
    font-size: var(--font-size-meta);
  }
`;

const CommitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const CommitItem = styled.a`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  text-decoration: none;
  transition: background-color var(--transition-fast) var(--easing-standard);
  border-radius: var(--radius-sm);

  &:hover {
    background-color: rgba(255, 221, 26, 0.1);
  }

  .commit-hash {
    color: var(--yellow);
    font-weight: bold;
    min-width: 70px;
  }

  .commit-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .commit-date {
    color: var(--grey);
    font-size: var(--font-size-meta);
  }

  .commit-message {
    color: var(--white);
  }

  @media screen and (max-width: 760px) {
    flex-direction: column;
    gap: var(--spacing-xs);

    .commit-hash {
      min-width: unset;
    }
  }
`;

const GitHubLink = styled.div`
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(255, 221, 26, 0.2);
  font-size: var(--font-size-small);
  
  a {
    color: var(--grey);
    text-decoration: none;
    transition: color var(--transition-fast) var(--easing-standard);
    
    &:hover {
      color: var(--yellow);
    }
  }
`;

const Changelog = ({ slug, commits = [] }) => {
  const githubRepoUrl = 'https://github.com/jarossnd/jason-ross-dev-v2';
  const fileHistoryUrl = `${githubRepoUrl}/commits/main/blog/posts/${slug}`;

  // If we have real commits, use them, otherwise show a simple message
  const hasCommits = commits.length > 0;

  return (
    <ChangelogContainer>
      <ChangelogContent>
        {hasCommits ? (
          <>
            <CommitList>
              {commits.map((commit, index) => (
                <CommitItem
                  key={index}
                  href={`${githubRepoUrl}/commit/${commit.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View commit ${commit.hash}`}
                >
                  <span className="commit-hash">{commit.hash}</span>
                  <div className="commit-info">
                    <span className="commit-date">{commit.date}</span>
                    <span className="commit-message">{commit.message}</span>
                  </div>
                </CommitItem>
              ))}
            </CommitList>
          </>
        ) : (
          <CommitList>
            <CommitItem
              href={fileHistoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View commit history"
            >
              <div className="commit-info">
                <span className="commit-message">View commit history for this post on GitHub</span>
              </div>
            </CommitItem>
          </CommitList>
        )}
        
        <GitHubLink>
          <a
            href={fileHistoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View full history on GitHub"
          >
            Full history →
          </a>
        </GitHubLink>
      </ChangelogContent>
    </ChangelogContainer>
  );
};

export default Changelog;
