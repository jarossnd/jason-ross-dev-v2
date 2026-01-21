import React, { useEffect } from 'react';

const Comments = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'jarossnd/jason-ross-dev-comments');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'comments');
    script.setAttribute('theme', 'photon-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.appendChild(script);
    }
  }, []);

  return (
    <section id="comments-section" style={{ marginTop: '2rem' }}>
      Loading comments...
    </section>
  );
};

export default Comments;
