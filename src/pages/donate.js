import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';
import imgXmr from '../img/assets/xmr.svg';
import imgBitcoin from '../img/assets/bitcoin.svg';
import imgPaypal from '../img/assets/paypal.svg';
import imgXmrQRCode from '../img/qr_codes/xmr-jason-ross-dev.png';
import imgEth from '../img/assets/eth.svg';

const DonateStyles = styled.div`
  h2 {
    margin: 0px;
  }

  .donate-container {
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
  }

  .donate-container:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    border-color: var(--yellow); /* Apply yellow border on hover */
  }

  .crypto-string {
    font-size: var(--font-size-body);
    overflow-wrap: break-word;
  }

  button {
    width: 100px; /* Match the full-width style in contact.js */
    padding: 0.5em;
    border: none;
    background: var(--yellow);
    color: #333;
    font-size: var(--font-size-tiny);
    cursor: pointer;
    transition: background var(--transition-medium) var(--easing-standard), 
                font-weight var(--transition-medium) var(--easing-standard);
  }

  button:hover {
    background: var(--yellow);
    font-weight: bold;
  }

  button:focus {
    outline: 2px solid var(--yellow);
    outline-offset: 2px;
  }

  @media screen and (max-width: 760px) {
    .donate-container {
      border: var(--border-width) solid var(--black);
      border-radius: var(--radius-md);
      font-size: var(--font-size-body);
      text-decoration: none;
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-sm);
      background-color: var(--blue);
    }
  }
`;

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
};

const DonateOption = ({ imgSrc, altText, title, description, value, link }) => (
  <div className="donate-container">
    <h2>
      <img src={imgSrc} alt={altText} width="30" height="30" />
      &nbsp;{title}
    </h2>
    <p>{description}</p>
    {value && (
      <>
        <p className="crypto-string">{value}</p>
        <button 
          onClick={() => copyToClipboard(value)}
          aria-label={`Copy ${title} address to clipboard`}
        >
          Copy Address
        </button>
      </>
    )}
    {link && (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={`Donate via ${title} (opens in new window)`}
      >
        Donate Now
      </a>
    )}
  </div>
);

export default function DonatePage() {
  return (
    <>
      <div className="item1">
        <h1>Donate</h1>
        <p>
          Did you find a blog post or video helpful? Show your appreciation and
          send some coin. Never expected but always welcome.
        </p>
      </div>
      <div className="item3">
        <DonateStyles>
          <DonateOption
            imgSrc={imgXmr}
            altText="Monero Icon"
            title="Monero"
            description="Donate using Monero XMR using the following:"
            value="45S6eqcm4nZ8fCMiXYEg75dX8pWYixxE9eeqBte89cGWj1XVZ5wi6qeceFY9guGxvd9nMX2jiPfwe1Vm1Hnxid7FMc7C5uZ"
          />
          <DonateOption
            imgSrc={imgBitcoin}
            altText="XMR Icon"
            title="BitCoin"
            description="Donate using Bitcoin BTC using the following:"
            value="bc1qtew9qam62c9l4v32alvqehdw79jxly3dsk9w8p"
          />
          <DonateOption
            imgSrc={imgEth}
            altText="Ethereum Icon"
            title="Ethereum"
            description="Donate using Ethereum ETH using the following:"
            value="0xe49f6BcC4FE582562b4567f5656AAce91ccA156D"
          />
          <DonateOption
            imgSrc={imgPaypal}
            altText="XMR Icon"
            title="PayPal"
            description="You can donate using the following PayPal link:"
            link="https://www.paypal.com/donate?hosted_button_id=VAQTBWLXBKD3S"
          />
        </DonateStyles>
      </div>
    </>
  );
}

export const Head = () => <SEO title="Donate" />;
