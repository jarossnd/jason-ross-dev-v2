import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@reach/router';

// Custom, stylable comments widget with spam protection & moderation
// Configure API base via env: GATSBY_COMMENTS_API (e.g. https://comments.yourdomain.com)
// Defaults to Netlify Functions path when not provided.
const apiBase = process.env.GATSBY_COMMENTS_API || '/.netlify/functions/comments';
const recaptchaSiteKey = process.env.GATSBY_RECAPTCHA_SITE_KEY;

const Comments = () => {
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState(''); // spam trap
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load reCAPTCHA script once
  useEffect(() => {
    if (recaptchaSiteKey && typeof window !== 'undefined' && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const slug = useMemo(() => {
    if (typeof window === 'undefined') return '';
    // Ensure a normalized pathname (ending with slash) to avoid duplicates
    let p = location?.pathname || '';
    if (p && !p.endsWith('/')) p = `${p}/`;
    return p;
  }, [location]);

  useEffect(() => {
    if (!apiBase || !slug) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${apiBase}?slug=${encodeURIComponent(slug)}`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'omit',
        });
        if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
        const data = await res.json();
        if (!cancelled) setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!apiBase) return;

    // Honeypot check: if filled, silently fail (pretend success)
    if (honeypot.trim()) {
      setSuccess(true);
      setContent('');
      setTimeout(() => setSuccess(false), 3000);
      return;
    }

    if (!name.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // Get reCAPTCHA token if available
      let recaptchaToken = null;
      if (recaptchaSiteKey && window.grecaptcha) {
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'submit_comment' });
      }

      const res = await fetch(`${apiBase}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          slug,
          name: name.trim(),
          email: email.trim() || undefined,
          content: content.trim(),
          recaptchaToken,
        }),
        credentials: 'omit',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to submit comment (${res.status})`);
      }

      const saved = await res.json();
      if (saved && saved.comment) {
        setComments((prev) => [saved.comment, ...prev]);
      }
      setSuccess(true);
      setName('');
      setEmail('');
      setContent('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  }

  // Simple markdown to HTML (bold, italic, code, links)
  function renderMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background: var(--blue); padding: 2px 6px; border-radius: 3px;">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />');
  }

  if (!apiBase) {
    return (
      <section style={{ marginTop: '2rem' }} aria-live="polite">
        <h3 style={{ color: 'var(--yellow)', marginBottom: 'var(--spacing-sm)' }}>Comments</h3>
        <p style={{ color: 'var(--grey)' }}>
          Comments are temporarily disabled. Configure <strong>GATSBY_COMMENTS_API</strong> to enable the custom comments service.
        </p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: '2rem' }} aria-live="polite">
      <h3 style={{ color: 'var(--yellow)', marginBottom: 'var(--spacing-sm)' }}>Comments</h3>

      {/* Form */}
      <form onSubmit={onSubmit} style={{
        background: 'var(--dark)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {/* Honeypot: hidden field to catch bots */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 220px' }}>
            <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>Name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--grey)', background: 'var(--blue)', color: 'var(--white)' }}
            />
          </label>
          <label style={{ flex: '1 1 220px' }}>
            <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>Email (optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--grey)', background: 'var(--blue)', color: 'var(--white)' }}
            />
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 'var(--spacing-md)' }}>
          <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>
            Comment * <span style={{ fontSize: 'var(--font-size-tiny)', color: 'var(--orange)' }}>Markdown supported</span>
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--grey)', background: 'var(--blue)', color: 'var(--white)' }}
          />
        </label>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <button type="submit" disabled={submitting} style={{
            background: 'var(--yellow)', color: 'var(--black)', border: 'none',
            padding: '10px 16px', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer'
          }}>
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
        {error && <p role="alert" style={{ color: 'var(--orange)', marginTop: 'var(--spacing-sm)' }}>{error}</p>}
        {success && <p style={{ color: 'var(--green)', marginTop: 'var(--spacing-sm)' }}>Thanks! Your comment was posted.</p>}
      </form>

      {/* List */}
      {loading ? (
        <p style={{ color: 'var(--grey)' }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ color: 'var(--grey)' }}>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {comments.map((c) => (
            <li key={c.id} style={{
              background: 'var(--dark)',
              border: `1px solid ${c.approved === false ? 'rgba(255, 127, 45, 0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-sm)',
              opacity: c.approved === false ? 0.7 : 1,
            }}>
              <div style={{ color: 'var(--yellow)', marginBottom: 6, display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <strong>{c.authorName || 'Anonymous'}</strong>
                {c.createdAt && (
                  <span style={{ color: 'var(--grey)', fontSize: 'var(--font-size-tiny)' }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                )}
                {c.approved === false && (
                  <span style={{ color: 'var(--orange)', fontSize: 'var(--font-size-tiny)', fontWeight: 'bold' }}>
                    [Awaiting moderation]
                  </span>
                )}
              </div>
              <div
                style={{ color: 'var(--white)' }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(c.content) }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Comments;
