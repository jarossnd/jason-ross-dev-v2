import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const BlogStyles = styled.div`
  ol {
    padding: 0px;
    margin: 0px;
  }
`;

const PostStyles = styled.div`
  border: 3px solid var(--black);
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--blue);
  h3 {
    margin: 0px;
  }
  .post-link {
    text-decoration: none;
    color: var(--yellow);
  }
  a:hover {
    border-bottom: 3px solid var(--yellow);
    border-color: var(--yellow);
    border-bottom-color: var(--yellow);
  }
`;

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="All posts" />

        <p>
          No posts found. Add markdown posts to "content/blog" (or the directory
          you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <div location={location} title={siteTitle} className="item2">
      <h1>Posts</h1>
      <p>
        My latest articles can be found below. If you want to view posts related
        to a specific topic, please see <Link to="/topics">topics</Link>.
        Subscribe to my RSS feed{' '}
        <a href="https://www.jasonross.dev/rss.xml">here</a>.
      </p>
      <SEO title="Posts" />
      <BlogStyles>
        <ol style={{ listStyle: `none` }}>
          {posts.map((post) => {
            const title = post.frontmatter.title || post.fields.slug;
            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <PostStyles>
                    <h2>
                      <Link
                        to={post.fields.slug}
                        itemProp="url"
                        class="post-link"
                      >
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <p>Date: {post.frontmatter.date}</p>

                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.frontmatter.description || post.excerpt,
                        }}
                        itemProp="description"
                      />
                    </section>
                  </PostStyles>
                </article>
              </li>
            );
          })}
        </ol>
      </BlogStyles>
    </div>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`;
