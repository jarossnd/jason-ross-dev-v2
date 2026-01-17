import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const PostCardStyles = styled.div`
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-p);
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--blue);
  transition: transform var(--transition-medium) var(--easing-standard), 
              box-shadow var(--transition-medium) var(--easing-standard), 
              border-color var(--transition-medium) var(--easing-standard);
  animation: fadeIn var(--transition-slow) var(--easing-in-out);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    border-color: var(--yellow);
  }

  h3 {
    margin: 0px;
    text-align: center;
    color: var(--yellow);
    font-size: var(--font-size-h3);
  }

  .post-link {
    text-decoration: none;
    color: var(--yellow);
    transition: color var(--transition-medium) var(--easing-standard);
  }

  .post-link:hover {
    color: var(--white);
  }

  .post-info {
    color: var(--grey);
    font-size: var(--font-size-meta);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm);
  }

  p {
    color: var(--white);
  }

  a:hover {
    border-bottom: var(--border-width) solid var(--yellow);
    border-color: var(--yellow);
    border-bottom-color: var(--yellow);
  }

  @media screen and (max-width: 760px) {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-body);

    h3 {
      font-size: var(--font-size-h3);
    }

    .post-info {
      font-size: var(--font-size-small);
      flex-direction: column;
      gap: var(--spacing-xs);

      span:nth-child(2) {
        display: none; /* Hide the | separator on mobile */
      }
    }

    &:hover {
      transform: scale(1.02); /* Reduced scale for mobile */
    }
  }
`;

/**
 * PostCard - Reusable component for displaying blog post cards
 * @param {Object} post - The post object containing frontmatter and fields
 * @param {boolean} showExcerpt - Whether to show the post excerpt/description
 */
const PostCard = React.memo(({ post, showExcerpt = true }) => {
  const title = post.frontmatter.title || post.fields.slug;
  
  return (
    <li key={post.fields.slug}>
      <Link to={post.fields.slug} itemProp="url" className="post-link">
        <article
          className="post-list-item"
          itemScope
          itemType="http://schema.org/Article"
        >
          <PostCardStyles>
            <h3>
              <span itemProp="headline">{title}</span>
            </h3>
            <p className="post-info">
              <span>
                <span aria-hidden="true">📅</span>
                <span className="sr-only">Published:</span>{' '}
                Committed: {post.frontmatter.date}
              </span>
              <span aria-hidden="true">|</span>
              <span>
                <span aria-hidden="true">🕑</span>
                <span className="sr-only">Reading time:</span> {post.timeToRead} min
              </span>
            </p>
            {showExcerpt && (
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.frontmatter.description || post.excerpt,
                  }}
                  itemProp="description"
                />
              </section>
            )}
          </PostCardStyles>
        </article>
      </Link>
    </li>
  );
});

PostCard.propTypes = {
  post: PropTypes.shape({
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
    frontmatter: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    excerpt: PropTypes.string,
    timeToRead: PropTypes.number,
  }).isRequired,
  showExcerpt: PropTypes.bool,
};

PostCard.displayName = 'PostCard';

export default PostCard;
