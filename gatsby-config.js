require('dotenv').config();

const siteUrl = process.env.URL || `https://www.jasonross.dev`;

module.exports = {
  siteMetadata: {
    author: {
      name: `Jason Ross`,
      summary: `who creates technology videos and enjoys helping others.`,
    },
    title: `Jason Ross`,
    description: `The homepage of web developer and technology enthusiast Jason Ross. We discuss everything having to do with technology and there are no limits!`,
    siteUrl: `https://www.jasonross.dev`,
    twitter: `@jarossnd`,
    social: {
      twitter: `jarossnd`,
    },
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `      
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }`,
        feeds: [
          {
            title: 'Jason Ross RSS Feed',
            output: 'rss.xml',
            query: `
        {
          allMarkdownRemark(sort: {frontmatter: {date: ASC}}) {
            nodes {
              frontmatter {
                title
                date
                description
              }
              html
              fields {
                slug
              }
            }
          }
        }
        `,
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.nodes.map((node) => ({
                ...node.frontmatter,
                url: `${site.siteMetadata.siteUrl}${node.fields.slug}`,
                guid: `${site.siteMetadata.siteUrl}${node.fields.slug}`,
                custom_element: [{ 'content:encoded': node.html }],
              })),
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog/posts`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-source-cloudinary`,
            options: {
              cloudName: process.env.CLOUDINARY_CLOUD_NAME,
              apiKey: process.env.CLOUDINARY_API_KEY,
              apiSecret: process.env.CLOUDINARY_API_SECRET,
              resourceType: `image`,
              prefix: `website-pictures/`,
              context: true,
              tags: true,
              maxResults: 50
            },
          },
          {
            resolve: `gatsby-remark-embed-video`,
            options: {
              width: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              loadingStrategy: 'lazy', //Optional: Enable support for lazy-load offscreen iframes. Default is disabled.
              urlOverrides: [
                {
                  id: "youtube",
                  embedURL: videoId =>
                    `https://www.youtube-nocookie.com/embed/${videoId}`,
                },
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
              containerClass: "embedVideo-container", //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
              iframeId: false, //Optional: if true, iframe's id will be set to what is provided after 'video:' (YouTube IFrame player API requires iframe id)
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-plugin-sitemap`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-plugin-image`,
          {
            resolve: `gatsby-source-filesystem`,
            options: {
              name: `images`,
              path: `${__dirname}/src/images`
            }
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `G-S4R8Y7B1VF`,
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jason Ross - Technology Enthusiast`,
        short_name: `Jason Ross`,
        description: `The homepage of web developer and technology enthusiast Jason Ross. We discuss everything having to do with technology and there are no limits!`,
        start_url: `/`,
        background_color: `#0E0F19`,
        theme_color: `#ffdd1a`,
        display: `standalone`,
        icon: `src/images/icon.png`,
        icons: [
          {
            src: `src/images/icon.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `src/images/icon.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
        cache_busting_mode: `none`,
      },
    },
    `gatsby-plugin-offline`,
    'gatsby-plugin-styled-components',
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
  ],
};
