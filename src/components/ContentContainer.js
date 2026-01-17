import styled from 'styled-components';

/**
 * ContentContainer - Reusable styled container with consistent styling
 * Used across multiple pages for content sections
 */
const ContentContainer = styled.div`
  border: var(--border-width) solid ${props => props.borderColor || 'transparent'};
  border-radius: var(--radius-md);
  font-size: var(--font-size-p);
  text-decoration: none;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--blue);

  h2 {
    margin: 0px;
  }

  ul {
    list-style-type: none;
  }

  span.ltrText {
    unicode-bidi: bidi-override;
    direction: rtl;
  }

  @media screen and (max-width: 760px) {
    border: var(--border-width) solid var(--black);
    font-size: var(--font-size-body);
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm);
    
    ul {
      padding-left: var(--spacing-lg);
    }

    ul li {
      padding-left: 0px;
      position: unset;
    }

    ul li:before {
      margin: 0 0 0 -34px;
      text-align: right;
      width: 2em;
      display: inline-block;
      position: absolute;
      height: 100%;
    }
  }
`;

export default ContentContainer;
