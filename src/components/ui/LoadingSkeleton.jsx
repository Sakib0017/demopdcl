import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable loading skeleton component with healthcare-appropriate styling
 */
const LoadingSkeleton = ({ 
  variant = 'default', 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  count = 1,
  showPulse = true 
}) => {
  const baseClasses = `bg-gray-200 rounded-lg ${showPulse ? 'animate-pulse' : ''} ${width} ${height}`;
  
  const skeletonElements = [];
  
  for (let i = 0; i < count; i++) {
    switch (variant) {
      case 'avatar':
        skeletonElements.push(
          <div key={i} className={`${baseClasses} rounded-full w-16 h-16 ${className}`} />
        );
        break;
        
      case 'text':
        skeletonElements.push(
          <div key={i} className={`${baseClasses} h-4 mb-2 ${i === count - 1 ? 'w-3/4' : 'w-full'} ${className}`} />
        );
        break;
        
      case 'title':
        skeletonElements.push(
          <div key={i} className={`${baseClasses} h-8 w-3/4 ${className}`} />
        );
        break;
        
      case 'image':
        skeletonElements.push(
          <div key={i} className={`${baseClasses} w-full h-48 ${className}`} />
        );
        break;
        
      case 'card':
        skeletonElements.push(
          <div key={i} className={`p-4 border border-gray-200 rounded-lg shadow-sm ${className}`}>
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        );
        break;
        
      case 'partner-logo':
        skeletonElements.push(
          <div key={i} className={`${baseClasses} h-20 w-32 rounded-md ${className}`} />
        );
        break;
        
      case 'testimonial':
        skeletonElements.push(
          <div key={i} className={`h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 ${className}`}>
            <div className="animate-pulse">
              {/* Header */}
              <div className="p-6 pb-0 flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-16 bg-gray-200 rounded-full"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-4">
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              
              {/* Bottom accent */}
              <div className="h-2 bg-gray-200"></div>
            </div>
          </div>
        );
        break;
        
      case 'doctor-list':
        skeletonElements.push(
          <div key={i} className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className="animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        );
        break;
        
      case 'service-list':
        skeletonElements.push(
          <div key={i} className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className="animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        );
        break;
        
      case 'search-suggestions':
        skeletonElements.push(
          <div key={i} className={`bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
            <div className="animate-pulse">
              <div className="px-3 py-2 bg-gray-100">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="p-3 space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        break;
        
      default:
        skeletonElements.push(
          <div key={i} className={`${baseClasses} ${className}`} />
        );
    }
  }
  
  return (
    <>
      {skeletonElements}
    </>
  );
};

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf(['default', 'avatar', 'text', 'title', 'image', 'card', 'partner-logo', 'testimonial', 'doctor-list', 'service-list', 'search-suggestions']),
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  count: PropTypes.number,
  showPulse: PropTypes.bool,
};

/**
 * Specialized loading components for healthcare organization
 */
export const PartnerSkeleton = ({ count = 4 }) => (
  <div className="flex flex-wrap gap-4 justify-center">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton key={index} variant="partner-logo" className="m-4" />
    ))}
  </div>
);

export const TestimonialSkeleton = ({ count = 2 }) => (
  <div className="flex mx-auto p-0 justify-center justify-items-center flex-wrap gap-8 lg:gap-10">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton 
        key={index} 
        variant="testimonial" 
        className="sm:w-[550px] w-full shadow-lg" 
      />
    ))}
  </div>
);

export const SpinnerLoader = ({ size = 'medium', color = 'text-[#00984a]' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-current ${sizeClasses[size]} ${color}`}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

SpinnerLoader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
};

PartnerSkeleton.propTypes = {
  count: PropTypes.number,
};

TestimonialSkeleton.propTypes = {
  count: PropTypes.number,
};

/**
 * Search-specific skeleton components for Phase 3
 */
export const DoctorListSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton key={index} variant="doctor-list" />
    ))}
  </div>
);

export const ServiceListSkeleton = ({ count = 8 }) => (
  <div className="space-y-1">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton key={index} variant="service-list" />
    ))}
  </div>
);

export const SearchSuggestionsSkeleton = () => (
  <LoadingSkeleton variant="search-suggestions" />
);

DoctorListSkeleton.propTypes = {
  count: PropTypes.number,
};

ServiceListSkeleton.propTypes = {
  count: PropTypes.number,
};

export default LoadingSkeleton;