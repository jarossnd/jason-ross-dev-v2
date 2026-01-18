import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import './gallery.css'
import {useStaticQuery, graphql} from 'gatsby'

const ImageWrapper = styled.div`
  width: 100%;
  height: 350px;
  overflow: hidden;
  cursor: pointer;
  border-radius: var(--radius-sm);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-medium) var(--easing-standard);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(14, 15, 25, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity var(--transition-medium) var(--easing-standard),
              visibility 0s ${props => props.$isOpen ? '0s' : 'var(--transition-medium)'};
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const LightboxCaption = styled.figcaption`
  color: var(--yellow);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  text-align: center;
  max-width: 90vw;
  
  @media screen and (max-width: 760px) {
    font-size: var(--font-size-meta);
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--yellow);
  font-size: 4rem;
  cursor: pointer;
  padding: var(--spacing-md);
  transition: all var(--transition-fast) var(--easing-standard);
  z-index: 2001;
  font-family: 'Roboto Mono', monospace;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.2);
  }
  
  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
  
  @media screen and (max-width: 760px) {
    font-size: 3rem;
    padding: var(--spacing-sm);
  }
`;

const PrevButton = styled(NavButton)`
  left: var(--spacing-md);
  
  @media screen and (max-width: 760px) {
    left: var(--spacing-xs);
  }
`;

const NextButton = styled(NavButton)`
  right: var(--spacing-md);
  
  @media screen and (max-width: 760px) {
    right: var(--spacing-xs);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: none;
  border: none;
  color: var(--yellow);
  font-size: 3rem;
  cursor: pointer;
  padding: var(--spacing-sm);
  transition: all var(--transition-fast) var(--easing-standard);
  z-index: 2001;
  font-family: 'Roboto Mono', monospace;
  line-height: 1;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    transform: rotate(90deg) scale(1.2);
  }
  
  @media screen and (max-width: 760px) {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    font-size: 2.5rem;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  color: var(--grey);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-family: 'Roboto Mono', monospace;
  font-size: var(--font-size-small);
  opacity: 0.6;
  
  @media screen and (max-width: 760px) {
    bottom: var(--spacing-sm);
    font-size: var(--font-size-meta);
  }
`;

const jayaGram = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
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
    
    const clImages = data.allCloudinaryMedia.edges;
    
    const openLightbox = (index) => {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    };
    
    const closeLightbox = () => {
      setLightboxOpen(false);
      document.body.style.overflow = 'auto';
    };
    
    const goToPrevious = () => {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : clImages.length - 1));
    };
    
    const goToNext = () => {
      setCurrentImageIndex((prev) => (prev < clImages.length - 1 ? prev + 1 : 0));
    };
    
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (!lightboxOpen) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentImageIndex]);
    
    const currentImage = clImages[currentImageIndex];
    
    return (
      <div>
        <div className="image-grid">
          {clImages.map((image, index) => (
            <div className="image-item" key={`${index}-cl`}>
              <ImageWrapper
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && openLightbox(index)}
                aria-label={`View ${image.node.context.custom.alt}`}
              >
                <img src={image.node.secure_url} alt={image.node.context.custom.alt} loading="lazy" />
              </ImageWrapper>
              <figcaption style={{textAlign: `center`, paddingTop: `8px`}}>{image.node.context.custom.caption}</figcaption>
            </div>
          ))}
        </div>
        
        <LightboxOverlay 
          $isOpen={lightboxOpen} 
          onClick={closeLightbox}
        >
          <CloseButton 
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </CloseButton>
          
          <PrevButton 
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </PrevButton>
          
          <NextButton 
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
          >
            ›
          </NextButton>
          
          <LightboxContent onClick={(e) => e.stopPropagation()}>
            {currentImage && (
              <>
                <LightboxImage 
                  src={currentImage.node.secure_url} 
                  alt={currentImage.node.context.custom.alt}
                />
                <LightboxCaption>
                  {currentImage.node.context.custom.caption}
                </LightboxCaption>
              </>
            )}
          </LightboxContent>
          
          <ImageCounter>
            {currentImageIndex + 1} / {clImages.length}
          </ImageCounter>
        </LightboxOverlay>
      </div>
    )
  }
  export default jayaGram
  