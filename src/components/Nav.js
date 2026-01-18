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
    font-size: var(--font-size-p);
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
    transition: transform var(--transition-medium) var(--easing-standard), 
                background-color var(--transition-medium) var(--easing-standard);
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
  @media screen and (max-width: 960px) {
    .top-nav {
      height: 25px;
      position: relative;
      z-index: 1002;
    }
    .menu-button-container {
      display: flex;
      z-index: 1002;
      position: relative;
    }
    .menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: var(--blue);
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: var(--spacing-lg);
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition-medium) var(--easing-standard),
                  visibility 0s var(--transition-medium);
      z-index: 1000;
      margin: 0;
      padding: 8vh 0;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
    
    .menu::after {
      content: '';
      display: block;
      height: 15vh;
      width: 100%;
      flex-shrink: 0;
    }
    
    #mobileMenuCheckbox:checked ~ .menu {
      opacity: 1;
      visibility: visible;
      transition: opacity var(--transition-medium) var(--easing-standard),
                  visibility 0s 0s;
    }
    
    .menu > li {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      width: auto;
      background: none;
      border: none;
      transform: translateY(20px);
      opacity: 0;
      transition: all var(--transition-medium) var(--easing-bounce);
    }
    
    #mobileMenuCheckbox:checked ~ .menu li {
      transform: translateY(0);
      opacity: 1;
      border: none;
      height: auto;
      padding: 0;
    }
    
    /* Stagger animation for menu items */
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(1) { transition-delay: 0.1s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(2) { transition-delay: 0.15s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(3) { transition-delay: 0.2s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(4) { transition-delay: 0.25s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(5) { transition-delay: 0.3s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(6) { transition-delay: 0.35s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(7) { transition-delay: 0.4s; }
    #mobileMenuCheckbox:checked ~ .menu li:nth-child(8) { transition-delay: 0.45s; }
    
    .menu a {
      color: var(--yellow);
      font-size: 4rem;
      font-weight: bold;
      text-decoration: none;
      font-family: 'Roboto Mono', monospace;
      transition: all var(--transition-normal) var(--easing-standard);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-sm);
      visibility: visible;
      position: relative;
    }
    
    .menu a::before {
      content: '> ';
      opacity: 0;
      transform: translateX(-10px);
      transition: all var(--transition-normal) var(--easing-standard);
      display: inline-block;
    }
    
    .menu a:hover::before {
      opacity: 1;
      transform: translateX(0);
    }
    
    .menu a:hover {
      background-color: rgba(255, 221, 26, 0.1);
      transform: translateX(10px);
    }
  }
`;

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' },
  { name: 'Topics', path: '/topics' },
  { name: 'Images', path: '/images' },
  { name: 'Uses', path: '/uses' },
  { name: 'Donate', path: '/donate' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

class Nav extends Component {
  state = {
    scrolledClass: 'notFixed',
    checked: false,
  };

  setChecked = (checked) => {
    this.setState({ checked });
  };

  render() {
    const { checked } = this.state;
    return (
      <div>
        <NavStyles>
          <nav aria-label="Main Navigation">
            <section className="top-nav">
              <div>
                <Link to="/">&lt;JR /&gt;</Link>
              </div>
              <input 
                id="mobileMenuCheckbox" 
                type="checkbox" 
                checked={checked} 
                onChange={(e) => this.setChecked(e.target.checked)}
                aria-label="Toggle mobile menu" 
              />

              <label
                className="menu-button-container"
                htmlFor="mobileMenuCheckbox"
                aria-label="Mobile menu button"
              >
                <div className="menu-button" />
              </label>
              <ul className="menu">
                {menuItems.map(({ name, path }) => (
                  <li key={name}>
                    <Link to={path} onClick={() => this.setChecked(false)}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </nav>
        </NavStyles>
      </div>
    );
  }
}

export default Nav;
