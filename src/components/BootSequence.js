import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const BootContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #00ff00;
  font-family: 'Roboto Mono', monospace;
  padding: 2rem;
  overflow-y: auto;
  z-index: 99999;
  display: ${props => props.show ? 'block' : 'none'};
  animation: ${props => props.fadeOut ? `fadeOut var(--transition-slow) var(--easing-out) forwards` : 'none'};

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @media screen and (max-width: 760px) {
    padding: 1rem;
    font-size: 1.2rem;
  }
`;

const BootLine = styled.div`
  margin-bottom: 0.3rem;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity var(--transition-fast) var(--easing-in-out);
  line-height: 1.4;
  font-size: 1.4rem;

  @media screen and (max-width: 760px) {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
`;

const OKStatus = styled.span`
  color: #00ff00;
  margin-left: 1rem;
`;

const FailStatus = styled.span`
  color: #ff0000;
  margin-left: 1rem;
`;

const BootSequence = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const bootMessages = [
    '[    0.000000] Linux version 6.6.0-jasonross (jason@dev) (gcc version 13.2.0)',
    '[    0.001234] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1',
    '[    0.002456] Kernel command line: quiet splash',
    '[    0.005789] Memory: 16384MB RAM',
    '[    0.008912] CPU: Intel Core i7 @ 3.5GHz',
    '[    0.012345] Checking file systems...',
    '[    0.156789] /dev/sda1: clean, 245678/987654 files',
    '[    0.234567] Mounting local filesystems...                [ OK ]',
    '[    0.345678] Starting network service...                  [ OK ]',
    '[    0.456789] Initializing random number generator...      [ OK ]',
    '[    0.567890] Loading jasonross.dev configuration...',
    '[    0.678901] Parsing React components...                  [ OK ]',
    '[    0.789012] Initializing Gatsby build system...          [ OK ]',
    '[    0.890123] Loading GraphQL data layer...                [ OK ]',
    '[    0.987654] Compiling JavaScript bundles...              [ OK ]',
    '[    1.098765] Optimizing CSS styles...                     [ OK ]',
    '[    1.234567] Loading blog posts from markdown...          [ OK ]',
    '[    1.345678] Initializing syntax highlighting...          [ OK ]',
    '[    1.456789] Starting web server on port 8000...          [ OK ]',
    '[    1.567890] Applying developer theme customizations...   [ OK ]',
    '[    1.678901] Loading command palette...                   [ OK ]',
    '[    1.789012] Initializing code copy buttons...            [ OK ]',
    '[    1.890123] All systems operational.',
    '',
    'jasonross.dev login: jason',
    'Password: ********',
    'Last login: ' + new Date().toLocaleString(),
    '',
    'Welcome to jasonross.dev',
    '',
    'Starting GUI environment...',
  ];

  useEffect(() => {
    // Check if we've already shown the boot sequence in this session
    const hasBooted = sessionStorage.getItem('hasBooted');
    
    if (hasBooted) {
      setShow(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev < bootMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Start fade out after a brief pause
          setTimeout(() => {
            setFadeOut(true);
            // Hide completely after fade
            setTimeout(() => {
              setShow(false);
              sessionStorage.setItem('hasBooted', 'true');
            }, 500);
          }, 500);
          return prev;
        }
      });
    }, 80); // Adjust speed here (lower = faster)

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <BootContainer show={show} fadeOut={fadeOut}>
      {bootMessages.map((msg, index) => (
        <BootLine key={index} visible={index <= currentLine}>
          {msg.includes('[ OK ]') ? (
            <>
              {msg.split('[ OK ]')[0]}
              <OKStatus>[ OK ]</OKStatus>
            </>
          ) : msg.includes('[ FAIL ]') ? (
            <>
              {msg.split('[ FAIL ]')[0]}
              <FailStatus>[ FAIL ]</FailStatus>
            </>
          ) : (
            msg
          )}
        </BootLine>
      ))}
    </BootContainer>
  );
};

export default BootSequence;
