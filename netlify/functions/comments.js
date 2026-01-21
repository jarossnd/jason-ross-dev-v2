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
  console.log('[validateEnv] Checking env vars...');
  console.log('[validateEnv] GITHUB_TOKEN exists:', !!token);
  console.log('[validateEnv] GITHUB_TOKEN length:', token?.length);
  console.log('[validateEnv] COMMENTS_REPO:', repo);
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
    console.error('[ghFetch] Error response:', { status: res.status, path, text });
    const error = new Error(`GitHub API ${method} ${path} failed: ${res.status} ${text}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

async function findIssueBySlug({ token, repo, slug, postTitle }) {
  const [owner, repoName] = repo.split('/');
  
  // Normalize slug for comparison
  const slugNoLeadingSlash = slug.replace(/^\//, '');
  const slugNoTrailingSlash = slug.replace(/\/$/, '');
  const slugNoSlashes = slug.replace(/\//g, '');
  
  try {
    console.log('[findIssue] Starting search in repo:', `${owner}/${repoName}`);
    console.log('[findIssue] Looking for postTitle:', postTitle, 'slug:', slug);
    
    // Fetch all issues
    const url = `/repos/${owner}/${repoName}/issues?state=all&per_page=100`;
    console.log('[findIssue] Fetching from URL:', url);
    
    const allIssues = await ghFetch(url, { token });
    console.log('[findIssue] Got', allIssues.length, 'issues total');
    
    if (allIssues.length === 0) {
      console.log('[findIssue] No issues found in repo at all');
      return null;
    }
    
    // Log all issue titles for debugging
    allIssues.forEach((issue, idx) => {
      console.log(`[findIssue] Issue ${idx + 1}:`, issue.title);
    });
    
    // Try to find by post title first (for utterances compatibility)
    if (postTitle) {
      console.log('[findIssue] Searching for postTitle match...');
      for (const issue of allIssues) {
        const title = issue.title || '';
        if (title === postTitle || title.includes(postTitle)) {
          console.log('[findIssue] Found by title match!', title);
          return { number: issue.number };
        }
      }
    }
    
    // Try to match against slug-based titles (e.g., "setting-up-silient-account-config-with-onedrive/")
    console.log('[findIssue] Searching for slug-based title match...');
    for (const issue of allIssues) {
      const title = issue.title || '';
      // Check various slug formats
      if (title === slugNoLeadingSlash || 
          title === slugNoTrailingSlash ||
          title === slug ||
          title === `${slugNoLeadingSlash}/` ||
          title === `${slugNoTrailingSlash}/`) {
        console.log('[findIssue] Found by slug match!', title);
        return { number: issue.number };
      }
    }
    
    // Fallback: look for "Comments for {slug}" format
    console.log('[findIssue] Searching for "Comments for" format...');
    const slugWithTrail = slug.endsWith('/') ? slug : slug + '/';
    
    for (const issue of allIssues) {
      const title = issue.title || '';
      if (title === `Comments for ${slug}` || 
          title === `Comments for ${slugNoLeadingSlash}` || 
          title === `Comments for ${slugNoTrailingSlash}` ||
          title === `Comments for ${slugWithTrail}`) {
        console.log('[findIssue] Found by "Comments for" format!', title);
        return { number: issue.number };
      }
    }
    
    console.log('[findIssue] No matching issue found');
    return null;
  } catch (e) {
    console.error('[findIssue] Error fetching issues:', e.message);
    throw e;
  }
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
    let { token, repo } = { token: null, repo: null };
    try {
      const env = validateEnv();
      token = env.token;
      repo = env.repo;
    } catch (envErr) {
      console.error('[handler] Environment validation failed:', envErr.message);
      return jsonResponse(500, { error: `Server misconfiguration: ${envErr.message}` }, origin);
    }

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
    console.error('[handler] Uncaught error:', e);
    return jsonResponse(500, { error: msg }, event.headers?.origin);
  }
};
