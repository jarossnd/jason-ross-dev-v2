import React, { Component } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import 'typeface-roboto-mono';

const NavStyles = styled.nav`
  .top-nav {
    margin-left: auto;
    margin-right: auto;
    max-width: 1400px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: var(--blue);
    background: var(--blue);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: var(--yellow);
    height: 50px;
    padding: 1em;
    font-size: 3rem;
  }

  .menu {
    display: flex;
    flex-direction: row;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .menu > li {
    margin: 0 1rem;
  }

  .menu-button-container {
    display: none;
    height: 100%;
    width: 30px;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #mobileMenuCheckbox {
    display: none;
  }

  .menu-button,
  .menu-button::before,
  .menu-button::after {
    display: block;
    background-color: var(--yellow);
    position: absolute;
    height: 4px;
    width: 30px;
    transition: transform 400ms cubic-bezier(0.23, 1, 0.32, 1);
    border-radius: 2px;
  }

  .menu-button::before {
    content: '';
    margin-top: -8px;
  }

  .menu-button::after {
    content: '';
    margin-top: 8px;
  }

  #mobileMenuCheckbox:checked + .menu-button-container .menu-button::before {
    margin-top: 0px;
    transform: rotate(405deg);
  }

  #mobileMenuCheckbox:checked + .menu-button-container .menu-button {
    background: rgba(255, 255, 255, 0);
  }

  #mobileMenuCheckbox:checked + .menu-button-container .menu-button::after {
    margin-top: 0px;
    transform: rotate(-405deg);
  }
  @media screen and (max-width: 760px) {
    .top-nav {
      height: 25px;
    }
    .menu-button-container {
      display: flex;
    }
    .menu {
      position: absolute;
      top: 0;
      margin-top: 57px;
      left: 0;
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
    .menu a {
      color: var(--yellow);
      visibility: hidden;
    }
    .menu a:hover {
      border-bottom: 0px solid var(--yellow);
      border-color: var(--yellow);
      border-bottom-color: var(--yellow);
    }
    .menu li:hover {
      background-color: var(--dark);
    }
    #mobileMenuCheckbox ~ .menu li {
      height: 0;
      margin: 0;
      padding: 0;
      border: 0;
      transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
    }
    #mobileMenuCheckbox:checked ~ .menu li {
      border: 1px solid #333;
      height: 1em;
      padding: 1em;
      transition: height 400ms cubic-bezier(0.23, 1, 0.32, 1);
      visibility: visible;
    }
    #mobileMenuCheckbox:checked ~ .menu a {
      color: var(--yellow);
      visibility: visible;
    }
    .menu > li {
      display: flex;
      justify-content: center;
      margin: 0;
      padding: 0.5em 0;
      width: 100%;
      color: white;
      background-color: var(--blue);
    }
    .menu > li:not(:last-child) {
      border-bottom: 1px solid #444;
    }
  }
`;

class Nav extends Component {
  state = {
    scrolledClass: 'notFixed',
    checked: false,
  };

  render() {
    const { checked } = this.state;
    return (
      <div>
        <NavStyles>
          <section className="top-nav">
            <div>
              <Link to="/">&lt;JR /&gt;</Link>
            </div>
            <input id="mobileMenuCheckbox" type="checkbox" checked={checked} />

            <label
              className="menu-button-container"
              htmlFor="mobileMenuCheckbox"
              onClick={() => {
                this.setState({
                  checked: !checked,
                });
              }}
            >
              <div className="menu-button" />
            </label>
            <ul className="menu">
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/uses"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  Uses
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  to="/links"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  Links
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => {
                    this.setState({ checked: false });
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </section>
        </NavStyles>
      </div>
    );
  }
}

export default Nav;
