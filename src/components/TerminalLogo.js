import React from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  background-color: var(--dark);
  border: 3px solid var(--yellow);
  border-radius: 15px;
  padding: 2rem;
  margin: 3rem 0;
  font-family: 'Roboto Mono', monospace;
  box-shadow: 0 0 20px rgba(255, 221, 26, 0.3);

  @media screen and (max-width: 760px) {
    padding: 1.5rem;
    margin: 2rem 0;
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--grey);
`;

const TerminalButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const TerminalButton = styled.span`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const TerminalTitle = styled.span`
  margin-left: auto;
  color: var(--grey);
  font-size: 1.4rem;
`;

const TerminalContent = styled.div`
  color: var(--yellow);
  font-size: 1.6rem;
  line-height: 1.4;
  white-space: pre;
  overflow-x: auto;

  @media screen and (max-width: 760px) {
    font-size: 1.3rem;
  }
`;

const Prompt = styled.span`
  color: var(--green);
`;

const Command = styled.span`
  color: var(--white);
`;

const Output = styled.div`
  color: var(--yellow);
  margin-top: 0.5rem;
`;

const TerminalLogo = () => {
  return (
    <TerminalContainer>
      <TerminalHeader>
        <TerminalButtons>
          <TerminalButton color="#FF5F56" />
          <TerminalButton color="#FFBD2E" />
          <TerminalButton color="#27C93F" />
        </TerminalButtons>
        <TerminalTitle>jason@ross ~ terminal</TerminalTitle>
      </TerminalHeader>
      <TerminalContent>
        <Prompt>guest@jasonross.dev</Prompt>:<Command>~$</Command> cat welcome.txt
        <Output>{`
     ██╗ █████╗ ███████╗ ██████╗ ███╗   ██╗    ██████╗  ██████╗ ███████╗███████╗
     ██║██╔══██╗██╔════╝██╔═══██╗████╗  ██║    ██╔══██╗██╔═══██╗██╔════╝██╔════╝
     ██║███████║███████╗██║   ██║██╔██╗ ██║    ██████╔╝██║   ██║███████╗███████╗
██   ██║██╔══██║╚════██║██║   ██║██║╚██╗██║    ██╔══██╗██║   ██║╚════██║╚════██║
╚█████╔╝██║  ██║███████║╚██████╔╝██║ ╚████║    ██║  ██║╚██████╔╝███████║███████║
 ╚════╝ ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝
`}</Output>
        <div style={{ marginTop: '1rem' }}>
          <Prompt>guest@jasonross.dev</Prompt>:<Command>~$</Command> <span className="cursor"></span>
        </div>
      </TerminalContent>
    </TerminalContainer>
  );
};

export default TerminalLogo;
