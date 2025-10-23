# 🚀 Astro Project - Quick Start

## Project Location
```
/Users/jason/repos/jason-ross-dev-astro
```

## Start Development Server

```bash
cd /Users/jason/repos/jason-ross-dev-astro
npm run dev
```

Your site will be available at: **http://localhost:4321**

## Project Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

## What's Included

✅ Astro 5.15.0 (latest)
✅ TypeScript (strict mode)
✅ MDX support for blog posts
✅ Sitemap generation
✅ RSS feed support
✅ Example blog template
✅ Content Collections

## Next Steps

1. **Start the dev server** to see the default blog
   ```bash
   cd /Users/jason/repos/jason-ross-dev-astro && npm run dev
   ```

2. **Explore the structure**:
   - `src/pages/` - Your routes (like Gatsby!)
   - `src/content/blog/` - Where blog posts go
   - `src/layouts/` - Page layouts
   - `src/components/` - Reusable components

3. **Test copying a blog post**:
   - Copy one post from `jason-ross-dev-v2/blog/posts/`
   - Put it in `jason-ross-dev-astro/src/content/blog/`
   - See if it renders

4. **Customize the theme**:
   - Look at `src/styles/global.css`
   - Add your color variables
   - Update the layout

## Key Files to Know

- `astro.config.mjs` - Main configuration
- `src/content.config.ts` - Content Collections schema
- `src/pages/index.astro` - Home page
- `src/pages/blog/` - Blog pages
- `src/layouts/BlogPost.astro` - Blog post layout

## Migration Priority

1. ✅ **Content** (blog posts) - Easiest, start here
2. **Styling** - Port your colors and theme
3. **Components** - Convert React to Astro
4. **Pages** - One page at a time
5. **Features** - RSS, analytics, etc.

## Helpful Resources

- [Astro Docs](https://docs.astro.build)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Migration from Gatsby](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/)

---

**Ready to start?** Run `npm run dev` and open http://localhost:4321! 🎉
