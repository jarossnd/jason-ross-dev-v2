import styled from 'styled-components';

/**
 * ContentContainer - Reusable styled container with consistent styling
 * Used across multiple pages for content sections
 */
const ContentContainer = styled.div`
  border: 3px solid ${props => props.borderColor || 'transparent'};
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 20px;
  padding: 2rem;
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
    border: 3px solid var(--black);
    font-size: 2rem;
    margin-bottom: 10px;
    padding: 1rem;
    
    ul {
      padding-left: 2rem;
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
