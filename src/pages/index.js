import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const BlogStyles = styled.div`
ol {
  padding: 0px;
  margin: 0px;
  text-align:center;
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
  font-size: var(--font-size-h3);
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

const Post = ({ post }) => {
  const title = post.frontmatter.title || post.fields.slug;
  return (
    <li key={post.fields.slug}>
      <Link to={post.fields.slug} itemProp="url" className="post-link">
        <article
          className="post-list-item"
          itemScope
          itemType="http://schema.org/Article"
        >
          <PostStyles>
            <h3>
              <span itemProp="headline">{title}</span>
            </h3>
            <p className="post-info" style={{ fontSize: `16px` }}>
              Post Date: {post.frontmatter.date} | 🕑 {post.timeToRead} min
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
        </article>
      </Link>
    </li>
  );
};

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
          occasionally some off topics. Most recently I have been getting in shape and participating in running events.
        </p>
        <SEO title="Technology Enthusiast" />
        <h2>Latest Posts</h2>
        <BlogStyles>
          <ol style={{ listStyle: `none` }}>
            {posts?.map((post) => (
              <Post key={post.fields.slug} post={post} />
            ))}
          </ol>
        </BlogStyles>
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
