import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@reach/router';

// Custom, stylable comments widget that talks to a REST API
// Configure API base via env: GATSBY_COMMENTS_API (e.g. https://comments.yourdomain.com)
// Defaults to Netlify Functions path when not provided.
const apiBase = process.env.GATSBY_COMMENTS_API || '/.netlify/functions/comments';

const Comments = () => {
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (!name.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`${apiBase}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ slug, name: name.trim(), email: email.trim() || undefined, content: content.trim() }),
        credentials: 'omit',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to submit comment (${res.status})`);
      }
      const saved = await res.json();
      // Optimistically append when API returns created comment
      if (saved && saved.comment) {
        setComments((prev) => [saved.comment, ...prev]);
      }
      setSuccess(true);
      setContent('');
    } catch (e) {
      setError(e?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
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
          <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>Comment *</span>
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
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              <div style={{ color: 'var(--yellow)', marginBottom: 6, display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <strong>{c.authorName || 'Anonymous'}</strong>
                {c.createdAt && (
                  <span style={{ color: 'var(--grey)', fontSize: 'var(--font-size-tiny)' }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
              <div style={{ color: 'var(--white)' }}>
                {c.content}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Comments;
