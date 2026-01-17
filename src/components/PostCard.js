import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const PostCardStyles = styled.div`
  border: 3px solid transparent;
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--blue);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

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
    transition: color 0.3s ease;
  }

  .post-link:hover {
    color: var(--white);
  }

  .post-info {
    color: var(--grey);
    font-size: 1.6rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  p {
    color: var(--white);
  }

  a:hover {
    border-bottom: 3px solid var(--yellow);
    border-color: var(--yellow);
    border-bottom-color: var(--yellow);
  }

  @media screen and (max-width: 760px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 2rem;

    h3 {
      font-size: var(--font-size-h3);
    }

    .post-info {
      font-size: 1.8rem;
      flex-direction: column;
      gap: 0.5rem;

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
                <span className="sr-only">Published:</span> {post.frontmatter.date}
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
