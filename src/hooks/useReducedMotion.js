/**
 * useReducedMotion Hook
 * Respects user's motion preferences for accessibility
 */

import { useState, useEffect } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Helper function to get motion-safe transition
  const getTransition = (defaultTransition) => {
    if (prefersReducedMotion) {
      return {
        duration: 0.01,
        ease: "linear",
      };
    }
    return defaultTransition;
  };

  // Helper function to get motion-safe variants
  const getVariants = (variants) => {
    if (prefersReducedMotion) {
      // Remove animations but keep the end states
      const safeVariants = {};
      Object.keys(variants).forEach(key => {
        safeVariants[key] = {
          ...variants[key],
          transition: { duration: 0.01, ease: "linear" },
        };
      });
      return safeVariants;
    }
    return variants;
  };

  return {
    prefersReducedMotion,
    getTransition,
    getVariants,
  };
};