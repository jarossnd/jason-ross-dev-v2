import React from 'react';
import styled from 'styled-components';

const FooterStyles = styled.div`
  footer p {
    text-align: center;
    font-size: 2rem;
    color: var(--text-color, white);
  }
  .footerSmall {
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    footer p {
      font-size: 1.5rem;
    }
  }
`;

export default function Footer() {
  return (
    <FooterStyles>
      <footer aria-label="Footer">
        <p>Copyright &copy; {new Date().getFullYear()} Jason Ross</p>
      </footer>
    </FooterStyles>
  );
}
