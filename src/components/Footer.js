import React from 'react';
import styled from 'styled-components';

const FooterStyles = styled.div`
  footer p {
    text-align: center;
    font-size: var(--font-size-body);
    color: var(--text-color, white);
  }
  .footerSmall {
    font-size: var(--font-size-tiny);
  }

  @media (max-width: 600px) {
    footer p {
      font-size: var(--font-size-small);
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
