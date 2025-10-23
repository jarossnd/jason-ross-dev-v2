import React from 'react'
import './gallery.css'
import {useStaticQuery, graphql} from 'gatsby'
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
              <a href={image.node.secure_url} target="_blank" rel="noopener noreferrer" aria-label={image.node.context.custom.alt}>
                <img src={image.node.secure_url} alt={image.node.context.custom.alt} loading="lazy" />
              </a>
              <figcaption style={{textAlign: `center`, paddingTop: `8px`}}>{image.node.context.custom.caption}</figcaption>
            </div>
          ))}
        </div>
      </div>
    )
  }
  export default jayaGram
  