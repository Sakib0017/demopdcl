import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Optimized image component with lazy loading, fallback, and loading states
 * Designed for healthcare organization with proper accessibility
 */
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc,
  placeholder,
  className = '',
  width,
  height,
  lazy = true,
  onLoad,
  onError,
  aspectRatio,
  objectFit = 'cover',
  ...props
}) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    currentSrc: src,
  });
  
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy]);

  // Handle successful image load
  const handleLoad = useCallback((event) => {
    setImageState(prev => ({ ...prev, loading: false, error: false }));
    onLoad?.(event);
  }, [onLoad]);

  // Handle image load error
  const handleError = useCallback((event) => {
    setImageState(prev => {
      // If we haven't tried the fallback yet, try it
      if (fallbackSrc && prev.currentSrc !== fallbackSrc) {
        return {
          ...prev,
          currentSrc: fallbackSrc,
          loading: true, // Keep loading state for fallback
        };
      }
      
      // If fallback also failed or no fallback provided
      return {
        ...prev,
        loading: false,
        error: true,
      };
    });
    
    onError?.(event);
  }, [fallbackSrc, onError]);

  // Reset state when src changes
  useEffect(() => {
    setImageState({
      loading: true,
      error: false,
      currentSrc: src,
    });
  }, [src]);

  // Container styles with aspect ratio
  const containerStyles = {
    ...(aspectRatio && { aspectRatio }),
    ...(width && { width }),
    ...(height && { height }),
  };

  // Base image classes
  const imageClasses = `transition-opacity duration-300 ${
    imageState.loading ? 'opacity-0' : 'opacity-100'
  } ${className}`;

  // Image styles
  const imageStyles = {
    objectFit,
    width: '100%',
    height: '100%',
  };

  // Render placeholder while loading or on error
  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }

    // Default placeholder based on state
    if (imageState.error) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 border border-gray-200 rounded">
          <div className="text-center text-gray-400 p-4">
            <svg
              className="h-8 w-8 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="text-xs">Image unavailable</div>
          </div>
        </div>
      );
    }

    // Loading placeholder
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 animate-pulse rounded">
        <div className="text-center text-gray-400">
          <svg
            className="h-8 w-8 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div className="text-xs">Loading...</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={imgRef} 
      className="relative overflow-hidden" 
      style={containerStyles}
      {...props}>
      
      {/* Show placeholder while loading or on error */}
      {(imageState.loading || imageState.error) && (
        <div className="absolute inset-0">
          {renderPlaceholder()}
        </div>
      )}

      {/* Actual image - only render when in view (for lazy loading) */}
      {isInView && !imageState.error && (
        <img
          src={imageState.currentSrc}
          alt={alt}
          className={imageClasses}
          style={imageStyles}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
        />
      )}
    </div>
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  placeholder: PropTypes.node,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lazy: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  aspectRatio: PropTypes.string,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
};

/**
 * Specialized component for partner logos
 */
export const PartnerLogo = ({ 
  src, 
  alt, 
  companyName,
  className = 'h-20 w-auto max-w-[200px]',
  lazy,
  ...props 
}) => {
  // For now, use simple img tag to test if images work
  return (
    <img
      src={src}
      alt={alt || `${companyName} logo`}
      className={className}
      style={{ objectFit: 'contain' }}
      onError={(err) => {
        // Show fallback text
        err.target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'flex items-center justify-center bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-400';
        fallback.innerHTML = `<div>${companyName}<br><span class="opacity-75">Logo</span></div>`;
        fallback.style.width = '160px';
        fallback.style.height = '80px';
        err.target.parentNode.appendChild(fallback);
      }}
      {...props}
    />
  );
};

PartnerLogo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  companyName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

/**
 * Specialized component for testimonial avatars
 */
export const TestimonialAvatar = ({ 
  src, 
  alt, 
  personName,
  className = 'w-20 h-16 rounded-full object-contain',
  ...props 
}) => {
  return (
    <ImageWithFallback
      src={src}
      alt={alt || `Photo of ${personName}`}
      className={className}
      objectFit="contain"
      placeholder={
        <div className="flex items-center justify-center w-full h-full bg-[#00984a]/10 border-2 border-[#00984a]/20 rounded-3xl">
          <div className="text-[#00984a] text-center">
            <svg
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
      }
      {...props}
    />
  );
};

TestimonialAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  personName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ImageWithFallback;