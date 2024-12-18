import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const BlogStyles = styled.div`
  ol {
    padding: 0px;
    margin: 0px;
    text-align: center;
  }

  div:hover {
    border: 2px solid var(--yellow);
  }
`;

const PostStyles = styled.div`
  border: 2px solid transparent;
  border-radius: 15px;
  font-size: 3rem;
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: var(--blue);
h3 {
  margin: 0px;
  text-align:center;
  color: var(--yellow);
}
.post-link {
  text-decoration: none;
  color: var(--yellow);
}
.post-info {
  color: var(--grey);
}
p {
color: var(--white);
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
        to a specific topic, please see the <Link to="/topics">topics</Link>{' '}
        page. Get notified when I create new posts by subscribing to my RSS feed{' '}
        <a href="https://www.jasonross.dev/rss.xml">here</a>.
      </p>
      <SEO title="Posts" />
      <BlogStyles>
        <ol style={{ listStyle: `none` }}>
          {posts.map((post) => {
            const title = post.frontmatter.title || post.fields.slug;
            return (
              <li key={post.fields.slug}>
                <Link
                        to={post.fields.slug}
                        itemProp="url"
                        class="post-link"
                      >
                        <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <PostStyles>
                    <h3>
                      
                        <span itemProp="headline">{title}</span>
                      
                    </h3>
                    <p class="post-info "style={{ fontSize: `16px` }}>
                      Date: {post.frontmatter.date} | 🕑 {post.timeToRead} min
                    </p>

                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.frontmatter.description || post.excerpt,
                        }}
                        itemProp="description"
                      />
                    </section>
                  </PostStyles>
                </article></Link>
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
        timeToRead
      }
    }
  }
`;
