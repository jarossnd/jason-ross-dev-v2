import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const RecentPostsStyles = styled.div`
ol {
  padding: 0px;
  margin: 0px;
  text-align:center;
}

div:hover {
  border: 3px solid var(--black);
}

`;

const PostStyles = styled.div`
border: 3px solid transparent;
border-radius: 15px;
font-size: 3rem;
text-decoration: none;
margin-bottom: 2rem;
padding: 2rem;
background-color: var(--blue);
h3 {
  margin: 0px;
  text-align:center;
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

const IndexPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title="Technology Enthusiast" />

        <p>
          No recent posts found.
        </p>
      </Layout>
    );
  }
  
  return (
    <div location={location} title={siteTitle} className="item2">
    <h1>Welcome</h1>
        <h2>Hello, my name is Jason 👋</h2>
        <p>
          Welcome to my corner on the internet! I talk about technology and other
          topics on my blog, and you will find other useful pages on this site.
          Sometimes I post videos on my YouTube channel found{' '}
          <a href="https://www.youtube.com/channel/UCP6Y5xvu8VSyXjFHwGMgc6g">
            here
          </a>
          . I typically write about Linux, utilities, servers, web dev, and
          occasionally some off topics. 
        </p>
        <SEO title="Technology Enthusiast" />
        <h2>Latest Posts</h2>
        <RecentPostsStyles>
        <ol style={{ listStyle: `none` }}>
          {posts?.map((post) => {
            const title = post.frontmatter.title || post.fields.slug;
            return (
              <li key={post.fields.slug}>
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <PostStyles>
                    <h3>
                      <Link
                        to={post.fields.slug}
                        itemProp="url"
                        class="post-link"
                      >
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h3>
                    <p style={{ fontSize: `16px`}}>Post Date: {post.frontmatter.date} | 🕑 {post.timeToRead} min</p> 

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
        </RecentPostsStyles>
    </div>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 3, sort: { fields: [frontmatter___date], order: DESC }) {
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