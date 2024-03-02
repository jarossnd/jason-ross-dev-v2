import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';
import imgXmr from '../img/assets/xmr.svg';
import imgBitcoin from '../img/assets/bitcoin.svg';
import imgPaypal from '../img/assets/paypal.svg';

const DonateStyles = styled.div`
  h2 {
    margin: 0px;
  }

  .donate-container {
    border: 3px solid transparent;
    border-radius: 15px;
    font-size: 3rem;
    text-decoration: none;
    margin-bottom: 20px;
    padding: 2rem;
    background-color: var(--blue);
  }

  .donate-container:hover{
    border: 3px solid var(--black);
  }

  .crypto-string {
    font-size: 2rem;
    overflow-wrap: break-word;
  }

  @media screen and (max-width: 760px) {
    .donate-container {
      border: 3px solid var(--black);
      border-radius: 15px;
      font-size: 2rem;
      text-decoration: none;
      margin-bottom: 10px;
      padding: 1rem;
      background-color: var(--blue);
    }
  }
`;

export default function DonatePage() {
  return (
    <>
      <SEO title="Donate" />
      <div className="item1">
        <h1>Donate</h1>
        <p>
          Did you find a blog post or video helpful? Show your appreciation and
          send some coin. Monero is preferred but I also accept BitCoin and
          PayPal.
        </p>
      </div>
      <div className="item3">
        <DonateStyles>
          <div className="donate-container">
            <h2>
              <img src={imgXmr} alt="XMR Icon" width="30" height="30" />
              &nbsp;Monero
            </h2>
            <p>Donate using Monero XMR using the following:</p>
            <p className="crypto-string">
              45S6eqcm4nZ8fCMiXYEg75dX8pWYixxE9eeqBte89cGWj1XVZ5wi6qeceFY9guGxvd9nMX2jiPfwe1Vm1Hnxid7FMc7C5uZ
            </p>
          </div>
          <div className="donate-container">
            <h2>
              <img src={imgBitcoin} alt="XMR Icon" width="30" height="30" />
              &nbsp;BitCoin
            </h2>
            <p>Donate using Bitcoin BTC using the following:</p>
            <p className="crypto-string">
              bc1qtew9qam62c9l4v32alvqehdw79jxly3dsk9w8p
            </p>
          </div>
          <div className="donate-container">
            <h2>
              <img src={imgPaypal} alt="XMR Icon" width="30" height="30" />
              &nbsp;PayPal
            </h2>
            You can donate using{' '}
            <a
              href="https://www.paypal.com/donate?hosted_button_id=VAQTBWLXBKD3S"
              target="_blank"
              rel="noopener noreferrer"
            >
              this
            </a>
            &nbsp;PayPal link.
          </div>
        </DonateStyles>
      </div>
    </>
  );
}
