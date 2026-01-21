# Utterances Installation Fix Steps

## Problem
Comments are disabled, and when users click "Sign in with GitHub," they're redirected to the homepage with query parameters instead of back to the blog post.

## Solution Steps

### 1. Verify/Create GitHub OAuth App
You need to ensure you have a GitHub OAuth App configured correctly:

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" or "New OAuth App"
3. **Required Settings:**
   - **Application name:** jasonross.dev Comments (or similar)
   - **Homepage URL:** `https://www.jasonross.dev`
   - **Authorization callback URL:** `https://www.jasonross.dev`
   
   > **Important:** The callback URL should be your main site URL, NOT the specific blog post. Utterances handles the redirect back to the post internally.

4. Copy the **Client ID** (no need to expose Client Secret for this implementation)

### 2. Verify Utterances Repository
The repository being used for comments storage:

1. Go to https://github.com/jarossnd/jason-ross-dev-comments
2. Verify it exists and is **PUBLIC**
3. Check that Issues are **ENABLED** (Settings > Features > Issues should be checked)
4. Make sure you have write access to create issues in this repo

### 3. Update Utterances Configuration (if needed)
The blog post template has been updated with a fresh implementation:
- Located in: `src/components/comments.js`
- Key changes:
  - Using `setAttribute` for data attributes (proper for utterances)
  - Proper cleanup on route changes
  - Better handling of iframe removal

### 4. Test the Configuration

1. **Clear cache:**
   ```bash
   gatsby clean
   ```

2. **Rebuild and test locally:**
   ```bash
   gatsby develop
   ```

3. **Visit a blog post locally** (e.g., http://localhost:8000/posts/some-post/)
4. **Try the comments:**
   - Scroll to the bottom where comments should appear
   - Click "Sign in with GitHub"
   - You should be redirected to GitHub OAuth
   - After signing in, you should be redirected **back to the post**, not the homepage

### 5. If Still Having Issues

**Check browser console (F12 > Console):**
- Look for any error messages
- Check network tab to see if utterances script is loading

**Common Issues:**

- **"Comments are disabled"** → Issues not enabled in the comments repo
- **Redirect to homepage** → OAuth callback URL misconfigured in GitHub app
- **Blank comments section** → Repository doesn't exist or isn't public
- **Script not loading** → CSP (Content Security Policy) headers blocking utteranc.es

### 6. Deployment
Once tested locally:
```bash
gatsby build
# Deploy to Netlify
netlify deploy
```

Or if using git auto-deploy:
```bash
git add .
git commit -m "Fix: Reinstall utterances with improved config"
git push origin main
```

## Environment Variables
No environment variables needed - utterances uses the repository name directly.

## Additional Notes
- Utterances stores comments as GitHub Issues in your `jason-ross-dev-comments` repo
- Each blog post gets one issue per unique pathname
- Users must be logged in to GitHub to comment
- Comments are loaded via iframe (safe cross-origin implementation)
