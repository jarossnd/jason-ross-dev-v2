# jason-ross-dev

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/jasonross/deploys)

## 🌐 Overview

This is the repository for my personal website at [www.jasonross.dev](https://www.jasonross.dev) - a technology blog and portfolio built with Gatsby and hosted on Netlify.

## ✨ Features

- 📝 Blog posts with MDX support
- 🖼️ Image optimization with Cloudinary integration
- 🎨 Styled with styled-components
- 📊 Google Analytics 4 tracking
- 🔍 SEO optimized with sitemap and RSS feed
- 📱 Fully responsive design
- ⚡ Progressive Web App (PWA) with offline support

## 🛠️ Tech Stack

- **Framework**: [Gatsby 5](https://www.gatsbyjs.com/)
- **Styling**: [styled-components](https://styled-components.com/)
- **Image Management**: [Cloudinary](https://cloudinary.com/)
- **Deployment**: [Netlify](https://www.netlify.com/)
- **Analytics**: Google Analytics 4

## 📋 Prerequisites

- **Node.js**: v20.x (LTS)
- **npm**: v10.x or higher

> **Note**: This project uses [fnm](https://github.com/Schniz/fnm) for Node version management. The `.node-version` file specifies the required version.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jarossnd/jason-ross-dev-v2.git
cd jason-ross-dev-v2
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> **Note**: The `--legacy-peer-deps` flag is needed for some Gatsby plugin compatibility.

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Important**: Never commit your `.env` file. It's already included in `.gitignore`.

### 4. Start the development server

```bash
npm run develop
```

The site will be available at [http://localhost:8000](http://localhost:8000)

GraphiQL IDE: [http://localhost:8000/___graphql](http://localhost:8000/___graphql)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run develop` | Start development server |
| `npm start` | Alias for `develop` |
| `npm run build` | Build for production |
| `npm run serve` | Serve production build locally |
| `npm run clean` | Clean Gatsby cache and public folder |

## 📁 Project Structure

```
jason-ross-dev-v2/
├── blog/                    # Blog content
│   ├── assets/             # Blog images and media
│   └── posts/              # Individual blog posts (MDX/Markdown)
├── src/
│   ├── components/         # React components
│   ├── pages/              # Gatsby pages
│   ├── styles/             # Global styles
│   └── templates/          # Page templates
├── static/                 # Static files
├── gatsby-config.js        # Gatsby configuration
├── gatsby-node.js          # Gatsby Node APIs
├── gatsby-browser.js       # Gatsby Browser APIs
├── gatsby-ssr.js           # Gatsby SSR APIs
└── package.json            # Dependencies
```

## 🖼️ Cloudinary Setup

This project uses Cloudinary for image hosting and optimization:

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the Cloudinary dashboard
3. Add them to your `.env` file
4. Images are sourced from the `website-pictures/` folder in your Cloudinary media library

## 🚢 Deployment

The site is automatically deployed to Netlify on every push to the `main` branch.

### Manual Deployment

```bash
npm run build
# Then deploy the public/ folder to your hosting service
```

## 🔧 Configuration

### Google Analytics

Update the tracking ID in `gatsby-config.js`:

```javascript
{
  resolve: `gatsby-plugin-google-gtag`,
  options: {
    trackingIds: [
      'G-XXXXXXXXXX', // Replace with your GA4 ID
    ],
  },
}
```

### Site Metadata

Edit site information in `gatsby-config.js`:

```javascript
siteMetadata: {
  title: `Your Name`,
  description: `Your site description`,
  siteUrl: `https://yoursite.com`,
  // ...
}
```

## 🐛 Troubleshooting

### Port 8000 is already in use

```bash
npm run clean
# Then start again
npm run develop
```

### Node version issues

Make sure you're using Node.js v20:

```bash
# If using fnm
fnm use 20

# If using nvm
nvm use 20
```

### Missing dependencies

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📝 Writing Blog Posts

Blog posts are located in `blog/posts/` directory. Each post should:

1. Be in its own folder (e.g., `blog/posts/my-post/`)
2. Contain an `index.md` or `index.mdx` file
3. Include frontmatter with required fields:

```markdown
---
title: "Your Post Title"
date: "2026-01-17"
description: "A brief description"
---

Your content here...
```

## 🤝 Contributing

This is a personal website, but if you find bugs or have suggestions, feel free to open an issue!

## 📄 License

© 2026 Jason Ross. All rights reserved.

## 🔗 Links

- **Website**: [www.jasonross.dev](https://www.jasonross.dev)
- **Twitter**: [@jarossnd](https://twitter.com/jarossnd)

---

Built with ❤️ using [Gatsby](https://www.gatsbyjs.com/)