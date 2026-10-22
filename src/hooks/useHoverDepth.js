/**
 * useHoverDepth Hook
 * Manages 3D hover effects and depth animations for navigation elements
 */

import { useState, useCallback } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export const useHoverDepth = (config = {}) => {
  const {
    maxRotation = 10,
    maxScale = 1.05,
    springConfig = { stiffness: 400, damping: 30 },
    enableMobile = false,
  } = config;

  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for smooth 3D transforms
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const depth = useMotionValue(0);

  // Spring animations for smooth movements
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [maxRotation, -maxRotation]),
    springConfig
  );
  
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-maxRotation, maxRotation]),
    springConfig
  );
  
  const scale = useSpring(
    useTransform(depth, [0, 1], [1, maxScale]),
    springConfig
  );

  // Mouse event handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    depth.set(1);
  }, [depth]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    depth.set(0);
  }, [mouseX, mouseY, depth]);

  const handleMouseMove = useCallback((event) => {
    if (!isHovered) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate relative position (-0.5 to 0.5)
    const x = (event.clientX - centerX) / (rect.width / 2);
    const y = (event.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  }, [isHovered, mouseX, mouseY]);

  // Touch handlers for mobile (if enabled)
  const handleTouchStart = useCallback((event) => {
    if (!enableMobile) return;
    
    setIsHovered(true);
    depth.set(0.5); // Reduced effect for mobile
  }, [enableMobile, depth]);

  const handleTouchEnd = useCallback(() => {
    if (!enableMobile) return;
    
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    depth.set(0);
  }, [enableMobile, mouseX, mouseY, depth]);

  // Motion props to spread onto components
  const motionProps = {
    style: {
      rotateX,
      rotateY,
      scale,
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    ...(enableMobile && {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    }),
  };

  // CSS transform for non-motion components
  const transform = `perspective(1000px) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg) scale(${scale.get()})`;

  return {
    isHovered,
    motionProps,
    transform,
    values: {
      rotateX,
      rotateY,
      scale,
      depth,
    },
  };
};