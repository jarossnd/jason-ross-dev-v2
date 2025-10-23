# Astro Migration Guide

## ✅ Project Created!

Your new Astro project is located at: `/Users/jason/repos/jason-ross-dev-astro`

## 🎯 What's Been Set Up

### Installed & Configured:
- ✅ Astro with TypeScript (strict mode)
- ✅ Blog template with example content
- ✅ Sitemap integration
- ✅ RSS feed support (@astrojs/rss)
- ✅ Content Collections (for blog posts)

### Project Structure:
```
jason-ross-dev-astro/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Astro/React components
│   ├── content/         # Blog posts and content
│   │   └── blog/        # Your blog posts go here
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes (file-based routing)
│   └── styles/          # Global styles
├── public/              # Static files
└── astro.config.mjs     # Astro configuration
```

## 📋 Migration Checklist

### Phase 1: Content Migration (Easy - Start Here!)
- [ ] Copy blog posts from `blog/posts/` to `src/content/blog/`
- [ ] Update frontmatter format (minimal changes needed)
- [ ] Copy images from `blog/assets/` to `src/assets/`
- [ ] Test that posts render correctly

### Phase 2: Styling
- [ ] Choose styling approach:
  - Option A: Keep styled-components (add @astrojs/react)
  - Option B: Use Astro's scoped styles (recommended)
  - Option C: Use Tailwind CSS
- [ ] Migrate global styles
- [ ] Create theme variables (colors, fonts)

### Phase 3: Components
- [ ] SEO component → Astro Head
- [ ] Layout components
- [ ] Bio component
- [ ] Navigation
- [ ] Footer
- [ ] Post card components

### Phase 4: Pages
- [ ] Home page (`/`)
- [ ] Posts page (`/posts`) with pagination
- [ ] Topics/Tags pages (`/topics`)
- [ ] Contact page
- [ ] Projects page
- [ ] Donate page
- [ ] Uses page
- [ ] Individual blog posts (dynamic routes)

### Phase 5: Features
- [ ] RSS feed configuration
- [ ] Sitemap configuration
- [ ] Analytics (Google Analytics or alternatives)
- [ ] Comments (if you want to keep them)
- [ ] Search functionality (optional)

### Phase 6: Deployment
- [ ] Update Netlify configuration
- [ ] Test build locally (`npm run build`)
- [ ] Deploy to Netlify
- [ ] Update DNS/domain settings
- [ ] Test production site

## 🚀 Quick Start Commands

### Development:
```bash
cd /Users/jason/repos/jason-ross-dev-astro
npm run dev
```
Opens at: http://localhost:4321

### Build:
```bash
npm run build
```

### Preview Production Build:
```bash
npm run preview
```

## 📚 Key Differences from Gatsby

### Content Collections vs GraphQL:
**Gatsby:**
```javascript
export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes { ... }
    }
  }
`
```

**Astro:**
```typescript
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
const sortedPosts = posts.sort((a, b) => 
  b.data.date.valueOf() - a.data.date.valueOf()
);
```

### Components:
**Gatsby (React):**
```jsx
import React from 'react';
export default function Component({ data }) {
  return <div>{data.title}</div>;
}
```

**Astro:**
```astro
---
const { data } = Astro.props;
---
<div>{data.title}</div>
```

### Routing:
- Gatsby: `src/pages/posts.js` → `/posts`
- Astro: `src/pages/posts.astro` → `/posts`
- Same file-based routing!

### Dynamic Routes:
- Gatsby: `gatsby-node.js` with `createPage()`
- Astro: `[slug].astro` with `getStaticPaths()`

## 🎨 Your Current Color Scheme

From your Gatsby site:
```css
--yellow: #your-yellow
--blue: #your-blue
--black: #your-black
--white: #your-white
--grey: #your-grey
```

We'll need to extract these and apply them to the Astro project.

## 📝 Next Steps

1. **Start the Astro dev server** to see the default blog
2. **Copy one blog post** to test the content migration
3. **Customize the theme** to match your current design
4. **Gradually port pages** one at a time

## 🆘 Need Help?

- [Astro Docs](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)

## 🎯 Migration Strategy

**Recommended Approach:**
1. Keep Gatsby site running (production)
2. Build Astro site locally
3. Port content and pages incrementally
4. Test thoroughly
5. Deploy Astro to a preview URL
6. Switch DNS when ready

**Timeline Estimate:**
- Content migration: 1-2 hours
- Basic pages: 2-4 hours
- Styling: 2-3 hours
- Testing & refinement: 2-3 hours
- **Total: ~1-2 days of work**

---

Ready to start? Let's begin with Phase 1: Content Migration! 🚀
