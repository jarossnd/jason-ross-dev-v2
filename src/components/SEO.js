import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

export default function SEO({ children, location, description, title, image }) {
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
      <link rel="icon" type="image/svc+xml" href="/favicon.svg" />
      <link rel="alternate icon" href="/favicon.ico" />
      {/* Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta name="description" content={seo.description} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: site.siteMetadata.siteUrl,
          name: site.siteMetadata.title,
          description: site.siteMetadata.description,
        })}
      </script>
      {children}
    </>
  );
}
