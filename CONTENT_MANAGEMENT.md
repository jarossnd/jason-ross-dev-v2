# Blog Post Content Management Guide

This guide explains how to control the publication status of blog posts and manage content disclaimers.

## Post Status Control

You can control which blog posts appear on your website using the `status` frontmatter field.

### Status Options

**1. Published (default)**
- Posts without a `status` field are considered published
- Published posts appear on all pages and in search results

**2. Draft**
- Use `status: "draft"` to hide posts that are in progress
- Draft posts will NOT appear on:
  - Homepage
  - All Posts page
  - Topic pages
  - Site navigation
- Draft posts are still generated but are only accessible via direct URL

**3. Archived**
- Use `status: "archived"` to hide outdated content
- Archived posts will NOT appear in listings
- Useful for keeping old content accessible via direct links without cluttering your site

### Example Frontmatter

```markdown
---
title: My New Blog Post
date: "2024-01-15"
description: "This is a draft post"
tags: ["gatsby", "react"]
status: "draft"
---
```

## Age-Based Disclaimers

Posts that are **3 years or older** automatically display a disclaimer warning readers that the content may be outdated.

### How It Works

- Automatically calculated based on post date
- Displays a yellow warning box at the top of the post
- Warns about potentially outdated:
  - Technology versions
  - Best practices
  - Software recommendations

### Example

A post from 2021 will show:
> ⚠️ **Content Notice**
> 
> This article was published 3 years ago and may contain outdated information.
> Technology, best practices, and software versions may have changed since publication.

## Updated Article References

If you've written a newer version of an article, you can link to it from the old post.

### How to Use

Add the `updatedArticle` field to the **OLD** post's frontmatter:

```markdown
---
title: Install Arch Linux 2021
date: "2021-05-15"
description: "Old installation guide"
tags: ["linux", "arch"]
updatedArticle: "/install-arch-linux-uefi-2024-thinkpad-t470p/"
---
```

### What Readers See

A notice appears at the top of the old post:
> 📝 **Updated Version Available:** A more recent article on this topic is available.
> [Install Arch Linux UEFI 2024 Thinkpad T470p](#)

## Complete Example

Here's a complete example of an old post with all features:

```markdown
---
title: Install Arch Linux 2021
date: "2021-05-15"
description: "Arch Linux installation guide from 2021"
tags: ["linux", "arch", "tutorial"]
status: "published"
updatedArticle: "/install-arch-linux-uefi-2024-thinkpad-t470p/"
---

Your post content here...
```

This post will:
- ✅ Appear in all listings (status is published)
- ⚠️ Show an age warning (published 3+ years ago)
- 📝 Link to the updated article

## Best Practices

### When to Use Draft Status
- Post is incomplete
- Content is being reviewed
- Waiting for images/media
- Scheduling future publication

### When to Use Archived Status
- Content is outdated but has historical value
- Post references deprecated technology
- Information is no longer accurate
- You want to keep URL alive but hide from listings

### When to Add Updated Article Link
- You've rewritten the tutorial for newer software
- Technology has significantly changed
- Old approach is no longer recommended
- You want to guide readers to better content

## Migration Guide

To mark existing posts as archived:

1. Add `status: "archived"` to the frontmatter
2. Optionally add `updatedArticle` if a newer version exists
3. The post remains accessible via direct URL
4. It won't appear in listings or search

## Querying in Development

All GraphQL queries automatically filter out draft and archived posts:

```graphql
allMarkdownRemark(
  filter: {
    frontmatter: {
      status: { nin: ["draft", "archived"] }
    }
  }
)
```

To see draft/archived posts in development, you'll need to modify the queries or access them via direct URL.
