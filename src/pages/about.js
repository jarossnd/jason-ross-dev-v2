import React from 'react';
import { Link } from 'gatsby';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO title="About" />
      <div className="item1">
        <h1>About</h1>
        <h2>Howdy, my name is Jason 😊</h2>
        <p>
          I am from and live in the United States.
        </p>
        <p>
          I enjoy anything that has to do with Linux based operating systems,
          coding, web servers, and everything in between. Some of my favorite
          utilities are VS Code, NeoVim, and Git. Occasionally, I also create
          technology videos on my YouTube channel found{' '}
          <a href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g">
            here
          </a>
          .
        </p>
        <p>Besides technology I enjoy topics around discipline, military, productivity, genealogy, finance, and health and fitness. I also enjoy DIY projects from custom building a desk to building a back yard pergola.</p>
        <p>
          In my younger years I started my own computer repair business when I was a young teenager
          making house calls and fixing computers for local businesses. I used
          to advertise my business with advertisements glued to the tops of
          pizza boxes at a local pizza restaurant. A few years later I was
          developing and designing websites while hosting the sites on my own web
          servers that I managed.
        </p>
        <p>
          Nowadays I work for a large software company helping people and
          customers get things done. I also have a family and I have a kid who is busy in sports.
        </p>
        <p>
          Sometimes I get questions about what hardware and software I use. You
          can view the stuff I use on my <Link to="/uses">uses</Link> page.
        </p>
        <p>Thanks for visiting! 🍻</p>
      </div>
    </>
  );
}
