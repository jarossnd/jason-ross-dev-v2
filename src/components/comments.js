import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from '@reach/router';

// Custom, stylable comments widget with spam protection & moderation
// Configure API base via env: GATSBY_COMMENTS_API (e.g. https://comments.yourdomain.com)
// Defaults to Netlify Functions path when not provided.
const apiBase = process.env.GATSBY_COMMENTS_API || '/.netlify/functions/comments';
const recaptchaSiteKey = process.env.GATSBY_RECAPTCHA_SITE_KEY;

const Comments = ({ postTitle }) => {
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
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment we're replying to

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
        const url = `${apiBase}?slug=${encodeURIComponent(slug)}&title=${encodeURIComponent(postTitle || '')}`;
        console.log('[Comments] Loading from:', url);
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' },
          credentials: 'omit',
        });
        if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
        const data = await res.json();
        console.log('[Comments] Loaded data:', data);
        if (!cancelled) setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (e) {
        console.error('[Comments] Error:', e);
        if (!cancelled) setError(e?.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, postTitle]);

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
          postTitle,
          name: name.trim(),
          email: email.trim() || undefined,
          content: content.trim(),
          recaptchaToken,
          parentId: replyingTo,
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
      setReplyingTo(null);
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

  // Render a single comment with optional replies
  function renderComment(comment, isReply = false) {
    return (
      <li
        key={comment.id}
        style={{
          background: isReply ? 'var(--blue)' : 'var(--dark)',
          border: `1px solid ${comment.approved === false ? 'rgba(255, 127, 45, 0.3)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)',
          marginLeft: isReply ? 'var(--spacing-lg)' : 0,
          opacity: comment.approved === false ? 0.7 : 1,
        }}
      >
        <div style={{ color: 'var(--yellow)', marginBottom: 6, display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <strong>{comment.authorName || 'Anonymous'}</strong>
          {comment.createdAt && (
            <span style={{ color: 'var(--grey)', fontSize: 'var(--font-size-tiny)' }}>
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          )}
          {comment.approved === false && (
            <span style={{ color: 'var(--orange)', fontSize: 'var(--font-size-tiny)', fontWeight: 'bold' }}>
              [Awaiting moderation]
            </span>
          )}
        </div>
        <div
          style={{ color: 'var(--white)', marginBottom: 'var(--spacing-md)' }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(comment.content) }}
        />
        {!isReply && (
          <button
            onClick={() => setReplyingTo(comment.id)}
            style={{
              background: 'transparent',
              color: 'var(--yellow)',
              border: '1px solid var(--yellow)',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 'var(--font-size-tiny)',
              fontWeight: 'bold',
            }}
          >
            Reply
          </button>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--spacing-md) 0 0 0' }}>
            {comment.replies.map((reply) => renderComment(reply, true))}
          </ul>
        )}
      </li>
    );
  }

  if (!apiBase) {
    return (
      <section style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '3px solid var(--yellow)',
        backgroundColor: 'var(--blue)',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-sm)',
      }} aria-live="polite">
        <h3 style={{ color: 'var(--yellow)', marginBottom: 'var(--spacing-sm)', marginTop: 0 }}>Comments</h3>
        <p style={{ color: 'var(--grey)' }}>
          Comments are temporarily disabled. Configure <strong>GATSBY_COMMENTS_API</strong> to enable the custom comments service.
        </p>
      </section>
    );
  }

  return (
    <section style={{
      marginTop: '4rem',
      paddingTop: '2rem',
      borderTop: '3px solid var(--yellow)',
      backgroundColor: 'var(--blue)',
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--radius-sm)',
    }} aria-live="polite">
      <h3 style={{ color: 'var(--yellow)', marginBottom: 'var(--spacing-md)', marginTop: 0 }}>Comments</h3>

      {/* Form */}
      <form onSubmit={onSubmit} style={{
        background: 'var(--dark)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--spacing-lg)',
        border: replyingTo ? '2px solid var(--yellow)' : 'none',
      }}>
        {replyingTo && (
          <div style={{ background: 'rgba(255, 221, 26, 0.1)', padding: 'var(--spacing-sm)', borderRadius: 4, marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--grey)', fontSize: 'var(--font-size-tiny)' }}>
              Replying to comment #{replyingTo}
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              style={{ background: 'transparent', color: 'var(--grey)', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-tiny)' }}
            >
              ✕ Cancel
            </button>
          </div>
        )}
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

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', width: '100%' }}>
          <label style={{ flex: '1 1 auto', minWidth: '100%' }}>
            <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>Name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--grey)', background: 'var(--dark)', color: 'var(--white)', boxSizing: 'border-box' }}
            />
          </label>
          <label style={{ flex: '1 1 auto', minWidth: '100%' }}>
            <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>Email (optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--grey)', background: 'var(--dark)', color: 'var(--white)', boxSizing: 'border-box' }}
            />
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 'var(--spacing-md)' }}>
          <span style={{ display: 'block', color: 'var(--grey)', marginBottom: 6 }}>
            {replyingTo ? 'Reply' : 'Comment'} * <span style={{ fontSize: 'var(--font-size-tiny)', color: 'var(--orange)' }}>Markdown supported</span>
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--grey)', background: 'var(--dark)', color: 'var(--white)' }}
          />
        </label>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <button type="submit" disabled={submitting} style={{
            background: 'var(--yellow)', color: 'var(--black)', border: 'none',
            padding: '10px 16px', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer'
          }}>
            {submitting ? 'Posting…' : replyingTo ? 'Post Reply' : 'Post Comment'}
          </button>
        </div>
        {error && <p role="alert" style={{ color: 'var(--orange)', marginTop: 'var(--spacing-sm)' }}>{error}</p>}
        {success && <p style={{ color: 'var(--yellow)', marginTop: 'var(--spacing-sm)' }}>Thanks! Your {replyingTo ? 'reply' : 'comment'} was posted.</p>}
      </form>

      {/* List */}
      {loading ? (
        <p style={{ color: 'var(--grey)' }}>Loading comments…</p>
      ) : comments.length === 0 ? (
        <p style={{ color: 'var(--grey)' }}>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {comments
            .filter((c) => !c.parentId) // Only top-level comments
            .map((c) => ({
              ...c,
              replies: comments.filter((reply) => reply.parentId === c.id),
            }))
            .map((c) => renderComment(c))}
        </ul>
      )}
    </section>
  );
};

export default Comments;
