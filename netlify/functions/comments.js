// Netlify Function: comments
// Backed by GitHub Issues in a separate repository
// Env required: GITHUB_TOKEN (repo scope), COMMENTS_REPO (e.g. "jarossnd/jason-ross-dev-comments")
// Optional: RECAPTCHA_SECRET_KEY for reCAPTCHA v3 verification

const GITHUB_API = 'https://api.github.com';
const RECAPTCHA_API = 'https://www.google.com/recaptcha/api/siteverify';

// Simple in-memory rate limiter (per IP, per slug)
// In production, use Redis or a persistent store
const rateLimitMap = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 comments per IP per minute per slug

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function jsonResponse(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
    body: JSON.stringify(body),
  };
}

function textResponse(statusCode, text, origin) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...corsHeaders(origin),
    },
    body: text,
  };
}

function validateEnv() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.COMMENTS_REPO;
  if (!token) throw new Error('Missing GITHUB_TOKEN env var');
  if (!repo) throw new Error('Missing COMMENTS_REPO env var');
  return { token, repo };
}

function normalizeSlug(slug) {
  if (!slug || typeof slug !== 'string') return '';
  try {
    let s = slug.trim();
    if (!s.startsWith('/')) s = '/' + s;
    if (!s.endsWith('/')) s = s + '/';
    return s;
  } catch {
    return '';
  }
}

async function ghFetch(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'jason-ross-dev-comments',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    const error = new Error(`GitHub API ${method} ${path} failed: ${res.status} ${text}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

async function findIssueBySlug({ token, repo, slug, postTitle }) {
  // Try to find issue by post title first (for utterances compatibility)
  if (postTitle) {
    // First try exact match
    let q = encodeURIComponent(`repo:${repo} type:issue in:title "${postTitle}"`);
    console.log('[findIssue] Trying exact title match:', postTitle);
    let data = await ghFetch(`/search/issues?q=${q}&per_page=10`, { token });
    console.log('[findIssue] Exact match results:', data.items?.length);
    if (data.items && data.items.length > 0) {
      console.log('[findIssue] Found by exact match:', data.items[0].title);
      return { number: data.items[0].number };
    }
    
    // Try partial match (in case issue title has extra text like " - Jason Ross")
    q = encodeURIComponent(`repo:${repo} type:issue in:title ${postTitle}`);
    console.log('[findIssue] Trying partial title match:', postTitle);
    data = await ghFetch(`/search/issues?q=${q}&per_page=10`, { token });
    console.log('[findIssue] Partial match results:', data.items?.length);
    if (data.items && data.items.length > 0) {
      // Find best match (issue title contains postTitle)
      for (const item of data.items) {
        const title = item.title || '';
        console.log('[findIssue] Checking title:', title);
        if (title.includes(postTitle)) {
          console.log('[findIssue] Found by partial match:', title);
          return { number: item.number };
        }
      }
    }
  }

  // Fallback: search for "Comments for {slug}" format
  const q = encodeURIComponent(`repo:${repo} type:issue in:title "Comments for"`);
  console.log('[findIssue] Trying fallback slug search');
  const data = await ghFetch(`/search/issues?q=${q}&per_page=100`, { token });
  
  // Look for exact match (with or without trailing slash)
  const slugNoTrail = slug.replace(/\/$/, '');
  const slugWithTrail = slug.endsWith('/') ? slug : slug + '/';
  
  if (data.items) {
    for (const item of data.items) {
      const title = item.title || '';
      if (title === `Comments for ${slug}` || 
          title === `Comments for ${slugNoTrail}` || 
          title === `Comments for ${slugWithTrail}`) {
        console.log('[findIssue] Found by slug match:', title);
        return { number: item.number };
      }
    }
  }
  console.log('[findIssue] No issue found');
  return null;
}

async function createIssueForSlug({ token, repo, slug, postTitle }) {
  const [owner, name] = repo.split('/');
  // Use post title if available, otherwise fall back to "Comments for {slug}"
  const title = postTitle || `Comments for ${slug}`;
  const body = `Auto-generated thread for comments on: ${slug}`;
  const labels = ['comments'];
  const issue = await ghFetch(`/repos/${owner}/${name}/issues`, {
    token,
    method: 'POST',
    body: { title, body, labels },
  });
  return { number: issue.number };
}

async function listCommentsForIssue({ token, repo, issueNumber }) {
  const [owner, name] = repo.split('/');
  const comments = await ghFetch(`/repos/${owner}/${name}/issues/${issueNumber}/comments?per_page=100`, { token });
  
  // Map to frontend shape and extract parentId from body if present
  return comments.map((c) => {
    const body = c.body || '';
    let parentId = null;
    let cleanContent = body;
    
    // Check if comment starts with parent_id marker: [parent_id:123456]
    const parentMatch = body.match(/^\[parent_id:(\d+)\]\n?([\s\S]*)/);
    if (parentMatch) {
      parentId = parseInt(parentMatch[1], 10);
      cleanContent = parentMatch[2];
    }
    
    return {
      id: c.id,
      authorName: c.user?.login || 'Guest',
      content: cleanContent,
      createdAt: c.created_at,
      parentId,
    };
  }).reverse(); // newest first in UI
}

async function addCommentToIssue({ token, repo, issueNumber, name, email, content, parentId }) {
  const [owner, nameRepo] = repo.split('/');
  const safeName = (name || 'Anonymous').toString().slice(0, 100);
  const safeEmail = (email || '').toString().slice(0, 200);
  const safeContent = (content || '').toString().slice(0, 5000);
  
  // Build body with parent_id marker if replying
  let bodyLines = [];
  if (parentId) {
    bodyLines.push(`[parent_id:${parentId}]`);
  }
  bodyLines.push(
    `**${safeName}**${safeEmail ? ` <${safeEmail}>` : ''} wrote:`,
    '',
    safeContent,
    '',
    `[PENDING]`, // Mark as pending moderation by default
  );
  
  const body = bodyLines.join('\n');
  const comment = await ghFetch(`/repos/${owner}/${nameRepo}/issues/${issueNumber}/comments`, {
    token,
    method: 'POST',
    body: { body },
  });
  return {
    id: comment.id,
    authorName: safeName,
    content: safeContent,
    createdAt: comment.created_at,
    approved: false, // Mark as pending until approved
    parentId: parentId || null,
  };
}

function checkRateLimit(ip, slug) {
  const key = `${ip}:${slug}`;
  const now = Date.now();
  if (!rateLimitMap[key]) {
    rateLimitMap[key] = [];
  }
  // Clean old entries
  rateLimitMap[key] = rateLimitMap[key].filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (rateLimitMap[key].length >= RATE_LIMIT_MAX) {
    return false; // Rate limited
  }
  rateLimitMap[key].push(now);
  return true; // OK
}

async function verifyRecaptcha(token, secretKey) {
  if (!secretKey || !token) return true; // Skip if not configured
  try {
    const res = await fetch(RECAPTCHA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });
    const data = await res.json();
    // Accept if score is > 0.3 (0=bot, 1=human)
    return data.success && (data.score || 0) > 0.3;
  } catch {
    // Fail open: if reCAPTCHA fails, allow the comment
    return true;
  }
}

exports.handler = async (event) => {
  const origin = event.headers?.origin;
  const clientIP = event.headers?.['x-forwarded-for']?.split(',')[0] || event.headers?.['client-ip'] || 'unknown';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(origin),
      body: '',
    };
  }

  try {
    const { token, repo } = validateEnv();

    if (event.httpMethod === 'GET') {
      const url = new URL(event.rawUrl || `http://localhost${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
      const slug = normalizeSlug(url.searchParams.get('slug'));
      const postTitle = url.searchParams.get('title') || '';
      console.log('[Comments API] GET request:', { slug, postTitle });
      if (!slug) return jsonResponse(400, { error: 'Missing slug' }, origin);

      let issue = await findIssueBySlug({ token, repo, slug, postTitle });
      console.log('[Comments API] Found issue:', issue);
      if (!issue) {
        // No thread yet
        console.log('[Comments API] No issue found, returning empty comments');
        return jsonResponse(200, { comments: [] }, origin);
      }
      const comments = await listCommentsForIssue({ token, repo, issueNumber: issue.number });
      console.log('[Comments API] Found comments:', comments.length);
      return jsonResponse(200, { comments }, origin);
    }

    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body || '{}');
      const slug = normalizeSlug(payload.slug);
      const postTitle = payload.postTitle || '';
      const name = (payload.name || '').trim();
      const email = (payload.email || '').trim();
      const content = (payload.content || '').trim();
      const recaptchaToken = payload.recaptchaToken;
      const parentId = payload.parentId ? parseInt(payload.parentId, 10) : null;

      if (!slug) return jsonResponse(400, { error: 'Missing slug' }, origin);
      if (!name || !content) return jsonResponse(400, { error: 'Name and content are required' }, origin);

      // Rate limit check
      if (!checkRateLimit(clientIP, slug)) {
        return jsonResponse(429, { error: 'Too many comments. Please wait a moment.' }, origin);
      }

      // reCAPTCHA check
      const recaptchaOk = await verifyRecaptcha(recaptchaToken, process.env.RECAPTCHA_SECRET_KEY);
      if (!recaptchaOk) {
        return jsonResponse(403, { error: 'Failed spam verification. Please try again.' }, origin);
      }

      let issue = await findIssueBySlug({ token, repo, slug, postTitle });
      if (!issue) {
        issue = await createIssueForSlug({ token, repo, slug, postTitle });
      }
      const comment = await addCommentToIssue({ token, repo, issueNumber: issue.number, name, email, content, parentId });
      return jsonResponse(201, { comment }, origin);
    }

    return textResponse(405, 'Method Not Allowed', origin);
  } catch (e) {
    const msg = e?.message || 'Internal Server Error';
    return jsonResponse(500, { error: msg }, event.headers?.origin);
  }
};
