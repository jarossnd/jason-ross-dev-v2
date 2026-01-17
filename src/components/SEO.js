import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

export default function SEO({ children, location, description, title, image, article }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          twitter
          siteUrl
        }
      }
    }
  `);
  
  const seo = {
    title: title ? `${title} - ${site.siteMetadata.title}` : site.siteMetadata.title,
    description: description || site.siteMetadata.description,
    image: image || `${site.siteMetadata.siteUrl}/icon.png`,
    url: location?.href || site.siteMetadata.siteUrl,
  };

  return (
    <>
      <html lang="en" dir="ltr" />
      <title>{seo.title}</title>
      {/* Fav Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="alternate icon" href="/favicon.ico" />
      {/* Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta name="description" content={seo.description} />
      <meta name="author" content="Jason Ross" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={seo.url} />
      
      {/* Open Graph */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:alt" content={seo.title} />
      <meta property="og:site_name" content={site.siteMetadata.title} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.siteMetadata.twitter} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={seo.title} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#0E0F19" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": article ? "BlogPosting" : "WebSite",
          url: seo.url,
          name: seo.title,
          headline: seo.title,
          description: seo.description,
          image: seo.image,
          author: {
            "@type": "Person",
            name: "Jason Ross",
            url: site.siteMetadata.siteUrl,
          },
          publisher: {
            "@type": "Person",
            name: "Jason Ross",
            url: site.siteMetadata.siteUrl,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": seo.url,
          },
        })}
      </script>
      {children}
    </>
  );
}
