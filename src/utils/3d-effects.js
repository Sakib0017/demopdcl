/**
 * 3D Effects Utilities for PDCL Navigation
 * Modern glassmorphism and depth effects for healthcare UI
 */

// Framer Motion Variants for 3D animations
export const navigationVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export const glassCardVariants = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
  },
  hover: {
    scale: 1.01, // More subtle for healthcare environment
    rotateX: 2,  // Reduced rotation for professional look
    rotateY: 2,
    z: 30,       // Reduced depth
    transition: {
      duration: 0.3, // Slower, more calming
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.99,
    rotateX: 1,
    rotateY: 1,
    z: 15,
  },
};

export const emergencyButtonVariants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 12px 0 rgba(0, 102, 66, 0.3)", // Medical green shadow
  },
  hover: {
    scale: 1.03, // Subtle scaling for professional look
    boxShadow: "0 6px 20px 0 rgba(0, 102, 66, 0.4)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
  // Removed aggressive pulse variant - not appropriate for healthcare
};

export const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    rotateY: -15,
  },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  hover: {
    x: 10,
    rotateY: 5,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    rotateX: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    rotateX: -5,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

// Glass effect utility functions - Healthcare optimized
export const getGlassStyle = (variant = 'light', opacity = 0.1) => {
  const baseStyle = {
    backdropFilter: 'blur(12px)', // Slightly more blur for softer effect
    WebkitBackdropFilter: 'blur(12px)', // Safari support
  };

  switch (variant) {
    case 'dark':
      return {
        ...baseStyle,
        background: `rgba(0, 0, 0, ${Math.min(opacity, 0.25)})`, // Increased opacity for better visibility
        border: `1px solid rgba(255, 255, 255, ${opacity * 0.6})`, // Stronger borders for contrast
      };
    case 'medical':
      return {
        ...baseStyle,
        background: `rgba(255, 255, 255, ${Math.min(opacity * 0.8, 0.85)})`, // More white background for better visibility
        border: `1px solid rgba(0, 152, 74, ${Math.max(opacity * 2, 0.5)})`, // Stronger medical green border
        boxShadow: `0 4px 20px rgba(0, 102, 66, ${opacity * 0.3})`, // Medical green glow
      };
    case 'emergency':
      // Replaced with calming amber for healthcare
      return {
        ...baseStyle,
        background: `rgba(255, 255, 255, ${Math.min(opacity * 0.9, 0.9)})`, // White background for visibility
        border: `1px solid rgba(245, 158, 11, ${Math.max(opacity * 2.2, 0.6)})`, // Stronger amber border
        boxShadow: `0 4px 20px rgba(245, 158, 11, ${opacity * 0.4})`, // Amber glow
      };
    default: // light
      return {
        ...baseStyle,
        background: `rgba(255, 255, 255, ${Math.min(opacity, 0.95)})`, // Increased max opacity for better visibility
        border: `1px solid rgba(255, 255, 255, ${Math.max(opacity * 1.8, 0.4)})`, // Stronger borders, minimum 0.4 opacity
      };
  }
};

// Depth-based shadow utilities
export const getDepthShadow = (level = 1, color = 'rgba(0, 0, 0, 0.1)') => {
  const shadows = {
    1: `0 1px 3px ${color}, 0 1px 2px ${color}`,
    2: `0 3px 6px ${color}, 0 3px 6px ${color}`,
    3: `0 10px 20px ${color}, 0 6px 6px ${color}`,
    4: `0 14px 28px ${color}, 0 10px 10px ${color}`,
    5: `0 19px 38px ${color}, 0 15px 12px ${color}`,
  };
  return shadows[level] || shadows[1];
};

// Medical-specific color utilities
export const medicalColors = {
  primary: '#006642',
  primaryLight: '#00984a',
  emergency: '#DC2626',
  emergencyLight: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  glass: {
    white: 'rgba(255, 255, 255, 0.9)', // Much stronger white for better visibility
    dark: 'rgba(0, 0, 0, 0.15)', // Stronger dark for better contrast
    medical: 'rgba(255, 255, 255, 0.85)', // White background with medical accent
    emergency: 'rgba(255, 255, 255, 0.9)', // Strong white background for emergency
  },
};

// Accessibility utilities
export const getAccessibleTransition = (reducedMotion = false) => {
  if (reducedMotion) {
    return {
      duration: 0.01, // Nearly instant for users who prefer reduced motion
      ease: "linear",
    };
  }
  return {
    duration: 0.3,
    ease: "easeOut",
  };
};

// Performance optimization for 3D transforms
export const get3DTransform = (x = 0, y = 0, z = 0, rotateX = 0, rotateY = 0, rotateZ = 0) => {
  return `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
};

// Responsive utilities for mobile 3D effects
export const getMobileOptimizedVariants = (baseVariants) => {
  return {
    ...baseVariants,
    hover: {
      ...baseVariants.hover,
      scale: Math.min(baseVariants.hover?.scale || 1, 1.02), // Reduce scale on mobile
      rotateX: (baseVariants.hover?.rotateX || 0) * 0.5, // Reduce rotation on mobile
      rotateY: (baseVariants.hover?.rotateY || 0) * 0.5,
    },
  };
};