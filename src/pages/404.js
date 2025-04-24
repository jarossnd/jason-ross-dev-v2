import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router

export default function FourOhFourPage() {
  return (
    <div className="item1">
      <h1>Oh No - HTTP 404 🙁</h1>
      <p>Hey there....this page does not exist! If you feel this is an error, open an issue on my <a href="https://github.com/jarossnd/jason-ross-dev-v2/issues">Git Hub Site</a></p>
      <Link to="/" className="btn">Go Back to Home</Link>
    </div>
  );
}
