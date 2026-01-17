import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const DisclaimerBox = styled.div`
  background-color: var(--dark);
  border: 3px solid var(--yellow);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  font-size: 3rem;
  position: relative;

  p {
    margin: 0;
    line-height: 1.6;
    color: var(--white);
    padding-right: 4rem;
  }

  a {
    color: var(--yellow);
    text-decoration: none;
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom: 2px solid var(--yellow);
    }
  }

  .note-icon {
    color: var(--yellow);
    font-weight: bold;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: var(--yellow);
    font-size: 3rem;
    cursor: pointer;
    padding: 0;
    width: 3rem;
    height: 3rem;
    line-height: 1;
    font-family: 'Roboto Mono', monospace;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.2);
    }

    &:focus {
      outline: 2px solid var(--yellow);
      outline-offset: 2px;
    }
  }

  @media screen and (max-width: 760px) {
    padding: 1.5rem;
    font-size: 2rem;
    margin: 1.5rem 0;

    p {
      padding-right: 3rem;
      font-size: 2rem;
    }

    .close-button {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      top: 0.75rem;
      right: 0.75rem;
    }
  }
`;

const PostDisclaimer = ({ postDate, updatedArticle, updatedArticleTitle }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Calculate age of post in years
  const currentDate = new Date();
  const publishDate = new Date(postDate);
  const ageInYears = Math.floor(
    (currentDate - publishDate) / (1000 * 60 * 60 * 24 * 365)
  );

  // Generate a unique key for this disclaimer based on post date and updated article
  const disclaimerKey = `disclaimer-dismissed-${postDate}${updatedArticle || ''}`;

  useEffect(() => {
    // Check if user has previously dismissed this disclaimer
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(disclaimerKey);
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [disclaimerKey]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(disclaimerKey, 'true');
    }
  };

  // Only show disclaimer if post is 3+ years old OR has an updated article
  if (ageInYears < 3 && !updatedArticle) {
    return null;
  }

  // Don't render if dismissed
  if (isDismissed) {
    return null;
  }

  return (
    <DisclaimerBox aria-hidden="true">
      <button
        className="close-button"
        onClick={handleDismiss}
        aria-label="Dismiss disclaimer"
        title="Dismiss"
      >
        ×
      </button>

      {ageInYears >= 3 && (
        <p>
          <span className="note-icon">NOTE:</span> This post is {ageInYears} years old. 
          Some information may be outdated.
        </p>
      )}

      {updatedArticle && ageInYears >= 3 && <p style={{ margin: '1rem 0' }}>&nbsp;</p>}

      {updatedArticle && (
        <p>
          <span className="note-icon">→</span> See updated version:{' '}
          <Link to={updatedArticle}>
            {updatedArticleTitle || 'Read the latest article'}
          </Link>
        </p>
      )}
    </DisclaimerBox>
  );
};

export default PostDisclaimer;
