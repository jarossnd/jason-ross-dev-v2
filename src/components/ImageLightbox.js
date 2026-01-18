import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(14, 15, 25, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: pointer;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: none;
  border: none;
  color: var(--yellow);
  font-size: 4rem;
  cursor: pointer;
  transition: transform var(--transition-normal);
  padding: 0;
  line-height: 1;
  
  &:hover {
    transform: rotate(90deg);
  }
  
  @media (max-width: 760px) {
    font-size: 3rem;
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
`;

const ImageLightbox = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    // Add click handlers to all images in the article
    const article = document.querySelector('article');
    if (!article) return;

    const images = article.querySelectorAll('img');
    
    images.forEach((img) => {
      // Skip if already has handler
      if (img.classList.contains('lightbox-enabled')) return;
      
      img.classList.add('lightbox-enabled');
      img.style.cursor = 'pointer';
      
      img.addEventListener('click', () => {
        setCurrentImage(img.src);
        setLightboxOpen(true);
      });
    });
  }, []);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    if (lightboxOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  if (!lightboxOpen) return null;

  return (
    <LightboxOverlay onClick={() => setLightboxOpen(false)}>
      <CloseButton onClick={() => setLightboxOpen(false)}>×</CloseButton>
      <LightboxImage 
        src={currentImage} 
        alt="Enlarged view"
        onClick={(e) => e.stopPropagation()}
      />
    </LightboxOverlay>
  );
};

export default ImageLightbox;
