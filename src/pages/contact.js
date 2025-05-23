import React from 'react';
import styled from 'styled-components';
import SEO from '../components/SEO';

const MyDetailsStyles = styled.div`
  border: 3px solid transparent;
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
    border: 3px solid transparent;
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
  input:focus,
  button:focus {
    outline: 2px solid var(--yellow);
    outline-offset: 2px;
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
          You can find my contact details below. There is also a contact form
          where you can submit your message. I do not return messages for
          marketing related email or spam. If you have found a typo or a 🐛 bug
          on this site, please feel free to open an issue on my{' '}
          <a
            href="https://github.com/jarossnd/jason-ross-dev-v2/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repro
          </a>
          .
        </p>
      </div>
      <div className="item2" />
      <div className="item3">
        <MyDetailsStyles>
          <h2>My Details</h2>
          <p>X (formally Twitter): <a href="https://x.com/jarossnd" target="_blank" rel="noopener noreferrer">@jarossnd</a></p>
          <p>GitHub: <a href="https://github.com/jarossnd" target="_blank" rel="noopener noreferrer">@jarossnd</a></p>
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
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Name" />
              </p>
              <p>
                <label>
                  <span>Email:</span>
                  <input type="email" name="email" placeholder="Email" required />
                  <span className="error-message">Please enter a valid email address.</span>
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
