import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';

const MyDetailsStyles = styled.div`
  border: 3px solid var(--black);
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 20px;
  padding: 2rem;
  background-color: var(--blue);

  span.ltrText {
    unicode-bidi: bidi-override;
    direction: rtl;
  }

  h2 {
    margin: 0px;
  }
`;

const FormContactStyles = styled.div`
  #contact-form {
    border: 3px solid var(--black);
    border-radius: 15px;
    font-size: 3rem;
    text-decoration: none;
    margin-bottom: 20px;
    padding: 2rem;
    background-color: var(--blue);
  }

  h2 {
    margin: 0px;
  }
  #contact,
  label,
  input[name='submit'] {
    position: relative;
  }
  label > span,
  input,
  textarea,
  button {
    box-sizing: border-box;
  }
  label {
    display: block;
  }
  label > span {
    display: none;
  }
  input,
  textarea,
  button {
    width: 100%;
    padding: 0.5em;
    border: none;
  }
  input[type='text'],
  input[type='email'],
  textarea {
    margin: 0 0 1em;
    border: 1px solid var(--yellow);
    outline: none;
  }
  input.invalid,
  textarea.invalid {
    border-color: #d5144d;
  }
  textarea {
    height: 6em;
  }
  input[type='submit'],
  button {
    background: var(--yellow);
    color: #333;
  }
  input[type='submit']:hover,
  button:hover {
    background: var(--yellow);
    font-weight: bold;
  }
  h3 {
    margin: 0px;
  }
  span.ltrText {
    unicode-bidi: bidi-override;
    direction: rtl;
  }
  @media screen and (max-width: 760px) {
    #contact-form h2 {
      font-size: 2em;
      line-height: 1.5;
    }
    label > span {
      vertical-align: top;
      display: inline-block;
      padding: 0.5em;
      border: 1px solid transparent;
      text-align: right;
    }
    input,
    textarea,
    button {
      line-height: 1.5;
    }
    textarea {
      height: 10em;
    }
    input[type='submit'],
    button {
    }
  }
`;

export default function ContactPage() {
  return (
    <>
      <SEO title="Contact" />
      <div className="item1">
        <h1>Contact</h1>
        <h2>Website Issues</h2>
        <p>
          Feel free to open an issue on my{' '}
          <a
            href="https://github.com/jarossnd/jason-ross-dev/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repro
          </a>{' '}
          if you have identified an issue on this website.
        </p>
        <p />
      </div>
      <div className="item2" />
      <div className="item3">
        <MyDetailsStyles>
          <h2>My Details</h2>
          <p>Twitter: @jarossnd</p>
          <p>GitHub: @jarossnd</p>
          <p>Code Pen: @jarossnd</p>
          <p>
            Email: <span className="ltrText">ved.ssornosaj@nosaj</span>
          </p>
        </MyDetailsStyles>
      </div>
      <div className="item4">
        <FormContactStyles>
          <section id="contact-form">
            <h2>Contact Form</h2>
            <form
              name="contactForm"
              method="POST"
              netlify-honeypot="bot-field"
              data-netlify="true"
            >
              <input type="hidden" name="bot-field" />
              <input type="hidden" name="form-name" value="contactForm" />
              <p>
                <label>
                  <span>Name:</span>
                  <input type="text" name="name" placeholder="Name" />
                </label>
              </p>
              <p>
                <label>
                  <span>Email:</span>
                  <input type="text" name="email" placeholder="Email" />
                </label>
              </p>
              <p>
                <label>
                  <span>Message:</span>
                  <textarea
                    name="message"
                    placeholder="Your message goes here"
                  />
                </label>
              </p>
              <div data-netlify-recaptcha="true" />
              <p>
                <button type="submit">Send</button>
              </p>
            </form>
          </section>
        </FormContactStyles>
      </div>
    </>
  );
}
