/**
 * useScrollPosition Hook
 * Tracks scroll position for parallax and sticky navigation effects
 */

import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    direction: 'up',
    isScrolling: false,
  });

  const [previousPosition, setPreviousPosition] = useState(0);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      // Determine scroll direction
      const direction = currentScrollY > previousPosition ? 'down' : 'up';

      setScrollPosition({
        x: currentScrollX,
        y: currentScrollY,
        direction,
        isScrolling: true,
      });

      setPreviousPosition(currentScrollY);

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set scrolling to false after scroll ends
      scrollTimeout = setTimeout(() => {
        setScrollPosition(prev => ({
          ...prev,
          isScrolling: false,
        }));
      }, 150);
    };

    // Add event listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [previousPosition]);

  // Helper functions
  const isAtTop = scrollPosition.y < 10;
  const isNearTop = scrollPosition.y < 100;
  const hasScrolled = scrollPosition.y > 0;

  return {
    scrollPosition,
    isAtTop,
    isNearTop,
    hasScrolled,
    direction: scrollPosition.direction,
    x: scrollPosition.x,
    y: scrollPosition.y,
    isScrolling: scrollPosition.isScrolling,
  };
};