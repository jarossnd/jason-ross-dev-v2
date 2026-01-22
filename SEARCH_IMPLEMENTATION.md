# Pagefind Search Implementation

## Overview

Full-text search powered by [Pagefind](https://pagefind.app/) - a static search library that creates a search index at build time with zero configuration.

## Features

✅ **Fast & Lightweight** - Indexes 39 blog posts, 175 words  
✅ **Terminal Aesthetic** - Matches site's developer theme  
✅ **Real-time Search** - Results appear as you type (300ms debounce)  
✅ **Keyword Highlighting** - Search terms highlighted in yellow  
✅ **URL Shareable** - Query stored in URL (`/search?q=linux`)  
✅ **Accessible** - Keyboard navigation, ARIA labels, focus management  
✅ **Privacy-Friendly** - No external services, no tracking  

## How It Works

1. **Build Time**: Pagefind crawls `public/` directory after Gatsby build
2. **Indexing**: Extracts content from elements with `data-pagefind-body`
3. **Runtime**: Search UI loads index on-demand (~15KB gzipped)
4. **Search**: Client-side fuzzy matching, ranked results

## Files Added/Modified

### New Files
- `/src/pages/search.js` - Search page component
- `/public/pagefind/` - Generated search index (auto-created on build)

### Modified Files
- `package.json` - Added pagefind dependency & build script
- `src/components/Nav.js` - Added Search link to navigation
- `src/components/CommandPalette.js` - Added Search command (🔍)
- `src/templates/blog-post.js` - Added Pagefind data attributes

## Data Attributes Used

```html
<!-- Main article content to index -->
<article data-pagefind-body>
  
  <!-- Extract as metadata -->
  <h1 data-pagefind-meta="title">Post Title</h1>
  <time data-pagefind-meta="date">January 21, 2026</time>
  <span data-pagefind-meta="tags">linux, gatsby</span>
  
  <!-- Exclude from index -->
  <footer data-pagefind-ignore>
    <!-- Comments, nav, etc -->
  </footer>
</article>
```

## Build Process

```bash
# Development (no search index)
npm run develop

# Production build with search index
npm run build
# Runs: gatsby build && npx pagefind --site public --output-subdir pagefind

# Serve production build
npm run serve
```

## Search Page Features

### Terminal Command Header
Shows dynamic grep command: `$ grep -r "your-query" ./blog/posts`

### Search Input
- Auto-focus on mount
- Yellow border with glow effect on focus
- 🔍 search icon
- Debounced queries (300ms)

### Results Display
- Shows count: "Found **3** results for **linux**"
- Terminal-styled cards with yellow left border
- Post title (clickable, yellow)
- Metadata: Date, Tags
- Excerpt with highlighted matches (yellow background)
- Hover effects (slide right, glow)

### Empty States
- **No query**: Shows popular topics
- **No results**: Helpful suggestions (check spelling, browse topics, etc.)

### Loading State
Animated dots: "Searching..."

## Search Configuration

Current settings in `package.json` build script:
```bash
npx pagefind --site public --output-subdir pagefind
```

Additional options available:
- `--glob` - Specific files to index
- `--exclude-selectors` - CSS selectors to ignore
- `--force-language` - Override language detection
- `--verbose` - Detailed logging

See [Pagefind docs](https://pagefind.app/docs/config-options/) for full options.

## Performance

### Build Stats
- **Pages Indexed**: 39 blog posts
- **Words Indexed**: 175 unique words
- **Build Time**: ~0.12 seconds
- **Index Size**: ~15KB (gzipped)

### Runtime Performance
- Search index loaded on `/search` page only (lazy loading)
- Client-side search (no server round-trips)
- Results render < 100ms for typical queries

## Accessibility

- ✅ Keyboard navigation (Tab, Enter)
- ✅ Screen reader friendly (ARIA labels)
- ✅ Focus management (auto-focus search input)
- ✅ Semantic HTML (`<article>`, `<time>`, etc.)
- ✅ High contrast (yellow on dark)

## SEO Benefits

- **Internal linking**: All results link to actual posts
- **Crawlable**: Search page itself is indexed
- **User engagement**: Helps users find content quickly
- **No duplicate content**: Search UI is client-side

## Usage

### Via Navigation
1. Click "Search" in main nav
2. Type your query
3. Click results to navigate

### Via Command Palette
1. Press `Ctrl+K` (or `Cmd+K` on Mac)
2. Type "Search" or click 🔍 Search
3. Opens `/search` page

### Direct URL
`https://jasonross.dev/search?q=arch+linux`

## Customization

### Change Excerpt Length
```javascript
// In search.js useEffect:
await pagefindModule.options({
  excerptLength: 30, // Default is 30 words
});
```

### Add More Metadata
```html
<!-- In blog-post.js -->
<span data-pagefind-meta="author">Jason Ross</span>
<span data-pagefind-meta="category">Tutorial</span>
```

### Modify Search UI
Edit `/src/pages/search.js`:
- Change colors in styled-components
- Adjust result card layout
- Add filters by tag/date
- Change sorting

## Future Enhancements

### Potential Additions
1. **Search Filters**
   - Filter by tag
   - Filter by date range
   - Filter by post type

2. **Search Suggestions**
   - Auto-complete based on indexed words
   - "Did you mean...?" for typos
   - Related searches

3. **Advanced Search**
   - Boolean operators (AND, OR, NOT)
   - Exact phrase matching ("linux arch")
   - Field-specific search (tag:gatsby)

4. **Search Analytics**
   - Track popular queries (GA4 events)
   - Identify content gaps
   - Improve based on search patterns

5. **Search from Anywhere**
   - Add search input to header
   - Floating search button
   - Slash (`/`) key to focus search

## Troubleshooting

### Search not working?
1. **Run production build**: `npm run build`
2. **Serve locally**: `npm run serve`
3. **Check index**: `public/pagefind/` should exist
4. **Check console**: Look for import errors

### No results showing?
1. **Verify data attributes**: Posts need `data-pagefind-body`
2. **Check build output**: Should say "Indexed X pages"
3. **Try rebuilding**: `npm run clean && npm run build`

### Index too large?
1. **Exclude more content**: Add `data-pagefind-ignore` to footers, nav, etc.
2. **Limit excerpts**: Reduce `excerptLength` in search.js
3. **Use custom selectors**: Target specific content areas only

## Resources

- [Pagefind Documentation](https://pagefind.app/)
- [Pagefind GitHub](https://github.com/CloudCannon/pagefind)
- [Gatsby + Pagefind Guide](https://pagefind.app/docs/running-pagefind/#gatsby)

---

**Implementation Date**: January 21, 2026  
**Developer**: Jason Ross  
**Status**: ✅ Production Ready
