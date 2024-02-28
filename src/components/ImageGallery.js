import React from 'react'
import './gallery.css'
import {useStaticQuery, graphql, Link} from 'gatsby'
const jayaGram = () => {
    const data = useStaticQuery(graphql`
      query CloudinaryImage {
        allCloudinaryMedia {
          edges {
            node {
              secure_url
              context {
                custom {
                  alt
                  caption
                }
              }
              resource_type
            }
          }
        }
      }
    `)
    const clImages = data.allCloudinaryMedia.edges
    return (
      <div>
        <div className="image-grid">
          {clImages.map((image, index) => (
            <div className="image-item" key={`${index}-cl`}>
              <Link href={image.node.secure_url}><img src={image.node.secure_url} alt={image.node.context.custom.alt} /></Link>
              <figcaption style={{textAlign: `center`, paddingTop: `8px`}}>{image.node.context.custom.caption}</figcaption>
            </div>
          ))}
        </div>
      </div>
    )
  }
  export default jayaGram
  