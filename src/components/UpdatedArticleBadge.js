import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const UpdateBadgeContainer = styled.div`
  margin: var(--spacing-lg) 0;
  background: linear-gradient(135deg, rgba(255, 221, 26, 0.1) 0%, rgba(255, 221, 26, 0.05) 100%);
  border: 2px solid var(--yellow);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  font-family: 'Roboto Mono', monospace;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: var(--yellow);
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const UpdateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--yellow);
  color: var(--dark);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-small);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-sm);
  
  span {
    font-size: 1.2em;
  }
`;

const UpdateTitle = styled.h3`
  color: var(--yellow);
  font-size: var(--font-size-p);
  margin: 0 0 var(--spacing-xs) 0;
  font-family: 'Roboto Mono', monospace;
`;

const UpdateText = styled.p`
  color: var(--grey);
  font-size: var(--font-size-small);
  margin: 0;
  line-height: 1.6;
  
  a {
    color: var(--yellow);
    text-decoration: underline;
    font-weight: bold;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const UpdateDate = styled.time`
  display: block;
  color: var(--grey);
  font-size: var(--font-size-meta);
  margin-top: var(--spacing-xs);
  opacity: 0.7;
`;

const UpdatedArticleBadge = ({ updatedDate, updatedTitle, updatedSlug }) => {
  if (!updatedDate) return null;

  return (
    <UpdateBadgeContainer>
      <UpdateBadge>
        <span>🔄</span> Updated Article
      </UpdateBadge>
      <UpdateTitle>This article has been updated</UpdateTitle>
      <UpdateText>
        {updatedTitle && updatedSlug ? (
          <>
            This post has been superseded by a newer version:{' '}
            <Link to={updatedSlug}>{updatedTitle}</Link>
          </>
        ) : (
          'This article has been updated with new information and improvements.'
        )}
      </UpdateText>
      <UpdateDate>Last updated: {updatedDate}</UpdateDate>
    </UpdateBadgeContainer>
  );
};

export default UpdatedArticleBadge;
