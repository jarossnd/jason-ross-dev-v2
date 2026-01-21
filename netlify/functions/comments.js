// Netlify Function: comments
// Backed by GitHub Issues in a separate repository
// Env required: GITHUB_TOKEN (repo scope), COMMENTS_REPO (e.g. "jarossnd/jason-ross-dev-comments")

const GITHUB_API = 'https://api.github.com';

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

async function findIssueBySlug({ token, repo, slug }) {
  // Prefer GitHub search API for exact title match
  const title = `Comments for ${slug}`;
  const q = encodeURIComponent(`repo:${repo} type:issue in:title "${title}"`);
  const data = await ghFetch(`/search/issues?q=${q}&per_page=1`, { token });
  const item = data.items && data.items[0];
  if (item && item.title === title) return { number: item.number };
  return null;
}

async function createIssueForSlug({ token, repo, slug }) {
  const [owner, name] = repo.split('/');
  const title = `Comments for ${slug}`;
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
  // Map to frontend shape
  return comments.map((c) => ({
    id: c.id,
    authorName: c.user?.login || 'Guest',
    content: c.body || '',
    createdAt: c.created_at,
  })).reverse(); // newest first in UI
}

async function addCommentToIssue({ token, repo, issueNumber, name, email, content }) {
  const [owner, nameRepo] = repo.split('/');
  const safeName = (name || 'Anonymous').toString().slice(0, 100);
  const safeEmail = (email || '').toString().slice(0, 200);
  const safeContent = (content || '').toString().slice(0, 5000);
  const bodyLines = [
    `**${safeName}**${safeEmail ? ` <${safeEmail}>` : ''} wrote:`,
    '',
    safeContent,
  ];
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
  };
}

exports.handler = async (event) => {
  const origin = event.headers?.origin;

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
      if (!slug) return jsonResponse(400, { error: 'Missing slug' }, origin);

      let issue = await findIssueBySlug({ token, repo, slug });
      if (!issue) {
        // No thread yet
        return jsonResponse(200, { comments: [] }, origin);
      }
      const comments = await listCommentsForIssue({ token, repo, issueNumber: issue.number });
      return jsonResponse(200, { comments }, origin);
    }

    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body || '{}');
      const slug = normalizeSlug(payload.slug);
      const name = (payload.name || '').trim();
      const email = (payload.email || '').trim();
      const content = (payload.content || '').trim();

      if (!slug) return jsonResponse(400, { error: 'Missing slug' }, origin);
      if (!name || !content) return jsonResponse(400, { error: 'Name and content are required' }, origin);

      let issue = await findIssueBySlug({ token, repo, slug });
      if (!issue) {
        issue = await createIssueForSlug({ token, repo, slug });
      }
      const comment = await addCommentToIssue({ token, repo, issueNumber: issue.number, name, email, content });
      return jsonResponse(201, { comment }, origin);
    }

    return textResponse(405, 'Method Not Allowed', origin);
  } catch (e) {
    const msg = e?.message || 'Internal Server Error';
    return jsonResponse(500, { error: msg }, event.headers?.origin);
  }
};
