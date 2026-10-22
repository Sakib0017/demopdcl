import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import "@fontsource/ubuntu";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import {
  getGlassStyle
} from "../utils/3d-effects";
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowDownIcon,
  BeakerIcon,
  SparklesIcon,
  UserIcon,
  HeartIcon,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// Icon lookup for contextual action buttons — pure, no reactive dependencies.
const getActionIcon = (iconName, actionType) => {
  // First, try to match by specific icon name from action.icon
  const iconMap = {
    'phone': PhoneIcon,
    'user-doctor': UserIcon,
    'heart': HeartIcon,
    'calendar': CalendarIcon,
    'map-pin': MapPinIcon,
    'truck': TruckIcon,
    'download': ArrowDownTrayIcon,
    'question-circle': QuestionMarkCircleIcon,
    'star': SparklesIcon,
    'building': BuildingOfficeIcon,
  };

  // If specific icon exists, use it
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }

  // Otherwise, fallback to action type mapping
  const typeMap = {
    'emergency': PhoneIcon,
    'primary': DocumentArrowDownIcon,
    'secondary': ChatBubbleLeftRightIcon,
    'frequent': SparklesIcon,
  };

  return typeMap[actionType] || BeakerIcon;
};

// Action Content Component - Fixed Left Overflow.
//
// This (and every other component below, down to SuggestionCard) is declared
// at module scope rather than inside SmartSidemenu. Previously they were all
// defined inline inside SmartSidemenu's render body, which gives them a new
// component identity on every SmartSidemenu re-render. React treats a changed
// component identity as a brand new element type and remounts it from
// scratch — replaying "initial" entrance animations and resetting hover/drag
// state — instead of just diffing props. Since useScrollPosition updates
// state on every native scroll event, SmartSidemenu re-rendered continuously
// while scrolling, so the suggestion cards (and action buttons) visibly
// flickered/reappeared the whole time. Keeping these as stable, module-level
// components lets React.memo (on SuggestionCard) and normal prop-diffing
// actually take effect.
const ActionContent = ({ action, Icon, isExpanded, emergencyMode }) => {
  const [labelRef, setLabelRef] = useState(null);
  const [useAlternatePosition, setUseAlternatePosition] = useState(false);

  // Check horizontal boundaries and adjust positioning
  useEffect(() => {
    if (labelRef && isExpanded) {
      const labelRect = labelRef.getBoundingClientRect();
      const buttonRect = labelRef.parentElement.getBoundingClientRect();

      // Estimate label width based on text length if not yet rendered
      const estimatedWidth = Math.max(action.label.length * 8 + 32, 120); // Rough estimate
      const actualWidth = labelRect.width || estimatedWidth;

      // Check if label would extend beyond left edge of viewport with some margin
      const leftEdgePosition = buttonRect.right - actualWidth - 12; // 12px for mr-3 margin
      const wouldOverflow = leftEdgePosition < 20; // 20px margin from viewport edge

      setUseAlternatePosition(wouldOverflow);
    }
  }, [labelRef, isExpanded, action.label]);

  // Calculate positioning classes based on available space
  const getLabelClasses = () => {
    if (useAlternatePosition) {
      // Position above the button when horizontal space is constrained
      return "absolute right-0 bottom-full mb-2 glass rounded-xl px-3 py-2 shadow-depth-2 text-sm max-w-48";
    } else {
      // Default position to the left of the button - now using flexbox alignment
      return "absolute right-full mr-3 glass rounded-xl px-4 py-2 shadow-depth-2 whitespace-nowrap flex items-center h-full";
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Action Button */}
    <motion.div
      className={clsx(
        "relative p-3 rounded-xl shadow-depth-3 border transition-all duration-200",
        "group-hover:shadow-depth-4 group-hover:-translate-y-1",
        "flex items-center justify-center", // Add flex centering
        action.type === 'emergency'
          ? "bg-red-600 border-red-500 text-white animate-pulse"
          : action.type === 'primary'
          ? "glass-medical border-PDCL-green/30 text-PDCL-green"
          : "glass border-white/30 text-gray-700"
      )}
      whileHover={{ scale: 1.02 }}
      style={
        action.type === 'emergency'
          ? {}
          : getGlassStyle(action.type === 'primary' ? 'medical' : 'light', 0.9)
      }>

      <Icon className="w-5 h-5" />

      {/* Priority Indicator */}
      {action.priority === 'high' && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-PDCL-green rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Emergency Pulse */}
      {action.type === 'emergency' && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-red-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      </motion.div>

      {/* Expanded Label - Now positioned relative to the flex container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            ref={setLabelRef}
            initial={{
              opacity: 0,
              x: useAlternatePosition ? 0 : 20,
              y: useAlternatePosition ? 10 : 0,
              scale: 0.8
            }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: useAlternatePosition ? 0 : 20,
              y: useAlternatePosition ? 10 : 0,
              scale: 0.8
            }}
            className={getLabelClasses()}
            style={getGlassStyle('light', 0.9)}>
            <div className={useAlternatePosition ? "text-center" : "text-right"}>
              <div className="font-semibold text-gray-900 text-sm font-ubuntu">
                {action.label}
              </div>
              {action.type === 'emergency' && emergencyMode && (
                <div className="text-xs text-red-600 animate-pulse">
                  🚨 After Hours Emergency
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Smart Action Button Component
const SmartActionButton = ({ action, index, isExpanded, emergencyMode, trackAction }) => {
  const Icon = getActionIcon(action.icon, action.type);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{
        delay: index * 0.08,
        duration: 0.3,
        ease: "easeOut"
      }}>

      {action.href ? (
        <motion.a
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noopener noreferrer" : undefined}
          onClick={() => trackAction(action.id, action.type)}
          className="flex items-center justify-end group cursor-pointer"
          aria-label={action.description || action.label || `Navigate to ${action.href}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <ActionContent action={action} Icon={Icon} isExpanded={isExpanded} emergencyMode={emergencyMode} />
        </motion.a>
      ) : (
        <Link
          to={action.href || action.to}
          onClick={() => trackAction(action.id, action.type)}
          className="flex items-center justify-end group cursor-pointer"
          aria-label={action.description || action.label || `Navigate to ${action.href || action.to}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <ActionContent action={action} Icon={Icon} isExpanded={isExpanded} emergencyMode={emergencyMode} />
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
};

// Individual suggestion card component with swipe functionality (memoized for
// performance — the custom comparator only re-renders when the suggestion
// itself changes, now that this component has a stable identity to memoize).
const SuggestionCard = React.memo(React.forwardRef(({ suggestion, isXSmallScreen, isSmallScreen, navigate, onDismiss }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragXMotion = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [currentDragValue, setCurrentDragValue] = useState(0);

  const handleDismiss = () => {
    onDismiss(suggestion.action);
  };

  // Animation configurations for different contexts
  const animations = {
    enter: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
    hover: { duration: 0.2, ease: "easeOut" },
    drag: { duration: 0, ease: "linear" },
    exit: { duration: 0.3, ease: [0.32, 0, 0.67, 0] }
  };

  // Momentum-based exit animation
  const handleDismissWithAnimation = (velocity) => {
    const exitDirection = velocity > 0 ? 1 : -1;
    const exitDistance = Math.min(Math.abs(velocity) * 0.5, 400);

    animate(cardRef.current, {
      x: exitDirection * exitDistance,
      opacity: 0,
      scale: 0.9,
      rotateZ: exitDirection * 5
    }, {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1]
    }).then(() => {
      onDismiss(suggestion.action);
    });
  };

  // Dynamic message based on drag progress
  const getMessage = (dragValue) => {
    const progress = Math.abs(dragValue) / 100;

    if (progress < 0.5) return null;  // No message early in drag
    if (progress < 0.8) return "Keep swiping...";
    if (progress >= 1.0) return "Release to dismiss!";
    return "Almost there!";
  };


  // Handle navigation (click vs drag detection)
  const handleNavigation = () => {
    if (!hasDragged) {
      if (suggestion.action.startsWith('http') || suggestion.action.startsWith('tel:')) {
        window.open(suggestion.action, suggestion.action.startsWith('http') ? '_blank' : '_self');
      } else {
        // Use React Router navigation
        navigate(suggestion.action);
      }
    }
  };

  // Keyboard event handler for accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation();
    } else if (event.key === 'Escape' || event.key === 'Delete') {
      event.preventDefault();
      // Animate fade out for keyboard dismiss
      animate(cardRef.current, {
        opacity: 0,
        scale: 0.95
      }, {
        duration: 0.25,
        ease: "easeOut"
      }).then(() => {
        handleDismiss();
      });
    }
  };

  // Enhanced gradient backgrounds based on suggestion type or context (memoized for performance)
  const cardBackground = useMemo(() => {
    const baseGradient = 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.25) 100%)';
    const hoverGradient = 'linear-gradient(135deg, rgba(0, 102, 66, 0.1) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(0, 152, 74, 0.05) 100%)';
    const pressedGradient = 'linear-gradient(135deg, rgba(0, 102, 66, 0.15) 0%, rgba(255, 255, 255, 0.25) 100%)';
    const focusedGradient = 'linear-gradient(135deg, rgba(0, 102, 66, 0.08) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(0, 152, 74, 0.08) 100%)';

    if (isPressed) return pressedGradient;
    if (isFocused) return focusedGradient;
    if (isHovered) return hoverGradient;
    return baseGradient;
  }, [isPressed, isFocused, isHovered]);

  return (
    <motion.div
      ref={cardRef}
      key={suggestion.action}
      role="button"
      tabIndex={0}
      aria-label={`Smart suggestion: ${suggestion.text}. Press Enter to take action, Escape to dismiss.`}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      initial={{ opacity: 0, y: 30, scale: 0.8, x: 50 }}
      animate={{
        opacity: isDragging ? 0.9 : 1,
        y: 0,
        scale: isDragging
          ? 0.98
          : isPressed
          ? 0.99
          : isHovered || isFocused
          ? 1.02
          : 1,
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.9,
        x: 50,
        transition: animations.exit,
      }}
      transition={{
        default: animations.enter,
        scale: animations.hover,
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      drag="x"
      dragConstraints={{
        left: -200, // Allow overshoot beyond dismiss point
        right: 20,  // Slight right overshoot for natural feel
      }}
      dragElastic={{
        left: 0.3,  // More responsive bounce-back on left drag
        right: 0.8  // Stronger resistance when dragging right (non-dismiss direction)
      }}
      onDragStart={(event) => {
        setIsDragging(true);
        setDragStartPos({ x: event.clientX, y: event.clientY });
        setHasDragged(false);
      }}
      onDragEnd={(_event, info) => {
        setIsDragging(false);

        const dragDistance = Math.abs(info.offset.x);
        const dragVelocity = Math.abs(info.velocity.x);

        // Dismiss if EITHER:
        // - Dragged more than 100px (reduced from 120px)
        // - OR velocity exceeds 500px/s (quick flick)
        const shouldDismiss = dragDistance > 100 || dragVelocity > 500;

        if (shouldDismiss) {
          // Animate out with exit velocity
          handleDismissWithAnimation(info.velocity.x);
        } else {
          // Smooth snap back using MotionValue
          dragXMotion.set(0);
        }
      }}
      onDrag={(_event, info) => {
        const rawOffset = info.offset.x;

        // Apply progressive resistance beyond -100px
        let adjustedOffset = rawOffset;
        if (rawOffset < -100) {
          const overshoot = Math.abs(rawOffset + 100);
          // Exponential resistance curve
          adjustedOffset = -100 - (overshoot * 0.3);
        }

        dragXMotion.set(adjustedOffset);
        setCurrentDragValue(adjustedOffset);
        if (Math.abs(rawOffset) > 5) {
          setHasDragged(true);
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={(e) => {
        e.preventDefault();

        // Calculate total drag distance (Euclidean)
        const totalDragDistance = Math.sqrt(
          Math.pow(e.clientX - dragStartPos.x, 2) +
          Math.pow(e.clientY - dragStartPos.y, 2)
        );

        // Only navigate if drag distance < 10px
        if (!hasDragged && totalDragDistance < 10) {
          handleNavigation();
        }
      }}
      className={clsx(
        "mb-3 rounded-2xl shadow-lg relative group focus:outline-none focus:ring-2 focus:ring-PDCL-green/50 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer select-none",
        isXSmallScreen ? "mr-2" : isSmallScreen ? "mr-3" : "mr-4"
      )}
      style={{
        x: dragXMotion,
        background: cardBackground,
        backdropFilter: "blur(8px) saturate(150%)",
        border:
          isHovered || isFocused
            ? "1px solid rgba(0, 102, 66, 0.4)"
            : "1px solid rgba(0, 102, 66, 0.2)",
        boxShadow:
          isHovered || isFocused
            ? "0 12px 24px rgba(0, 102, 66, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        willChange: isDragging ? "transform" : "auto",
        overflow: "visible", // Allow drag to extend beyond card bounds
        zIndex: isDragging ? 35 : "auto", // Bring to front when dragging, but below navbar
        maxWidth: "280px", // Prevent cards from becoming too wide
        minWidth: "220px", // Maintain consistent minimum width
      }}>
      {/* Dedicated drag handle area - always visible for better UX */}
      <div
        className={clsx(
          "absolute left-0 top-0 bottom-0 cursor-grab active:cursor-grabbing flex items-center justify-center transition-opacity duration-200",
          isXSmallScreen ? "w-8" : "w-10",
          isDragging ? "opacity-80" : "opacity-30 hover:opacity-100"
        )}>
        <div className="w-1.5 h-10 bg-gray-400 rounded-full shadow-sm" />
      </div>

      {/* Main content area - not draggable */}
      <div
        className={clsx(
          "relative z-10 cursor-pointer",
          isXSmallScreen
            ? "ml-8 p-3"
            : isSmallScreen
            ? "ml-10 p-3.5"
            : "ml-10 p-4"
        )}>
        {/* Enhanced swipe indicator with progressive visual feedback */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl"
          style={{
            opacity: Math.abs(currentDragValue) / 100 * 0.9,
            background: Math.abs(currentDragValue) > 30
              ? `linear-gradient(135deg, rgba(249, 115, 22, ${0.15 + (Math.abs(currentDragValue) / 100) * 0.15}) 0%, rgba(251, 146, 60, ${0.2 + (Math.abs(currentDragValue) / 100) * 0.3}) 100%)`
              : "transparent",
          }}>
          <AnimatePresence>
            {Math.abs(currentDragValue) > 50 && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 10 }}
                className="flex items-center gap-2 text-white font-semibold text-sm bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <motion.span
                  animate={{
                    scale: Math.abs(currentDragValue) >= 100 ? [1, 1.15, 1] : 1,
                    rotate: isDragging ? [-5, 5, -5] : 0
                  }}
                  transition={{
                    scale: { duration: 0.4, repeat: Math.abs(currentDragValue) >= 100 ? Infinity : 0 },
                    rotate: { duration: 0.2, ease: "easeInOut" }
                  }}>
                  {currentDragValue < 0 ? "👈" : "👉"}
                </motion.span>
                <span className="drop-shadow-sm">{getMessage(currentDragValue)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10">
          <div className="w-full">
            <div
              className={clsx(
                "font-semibold text-gray-900 font-ubuntu flex items-center justify-between",
                isXSmallScreen
                  ? "text-xs gap-1.5"
                  : isSmallScreen
                  ? "text-sm gap-2"
                  : "text-sm gap-2"
              )}>
              <div className="flex items-center gap-2">
                <motion.span
                  className={isXSmallScreen ? "text-sm" : "text-base"}
                  animate={{
                    rotate: isDragging ? [0, -8, 8, 0] : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.4, type: "spring" }}>
                  💡
                </motion.span>
                <span className="drop-shadow-sm leading-tight">
                  {suggestion.text}
                </span>
              </div>

              {/* Click indicator */}
              <motion.div
                className="text-PDCL-green opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                animate={{ x: isHovered ? 2 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Hover tooltip */}
            <motion.div
              className="text-xs text-PDCL-green font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ opacity: 0, y: -5 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : -5,
              }}
              transition={{ duration: 0.2 }}>
              Click to visit • Swipe to dismiss
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
        animate={{
          width: `${Math.min((Math.abs(currentDragValue) / 100) * 100, 100)}%`,
          opacity: isDragging ? 0.8 : 0,
          boxShadow: Math.abs(currentDragValue) >= 100
            ? "0 0 10px rgba(249, 115, 22, 0.6)"
            : "none"
        }}
        transition={{ duration: 0.05, ease: "linear" }}
      />

      {/* Simplified shine effect - single run on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12"
              animate={{
                x: isHovered ? "100%" : "-100%",
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on interaction */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(0, 102, 66, 0.2) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}), (prevProps, nextProps) => {
  // Only re-render if suggestion changes
  return prevProps.suggestion.action === nextProps.suggestion.action;
});

// Smart Suggestions Component - Enhanced with swipe-to-dismiss
const SmartSuggestions = ({
  suggestions,
  maxSuggestions,
  shouldScroll,
  isXSmallScreen,
  isSmallScreen,
  navigate,
  onDismiss,
}) => {
  if (suggestions.length === 0) return null;

  const visibleSuggestions = suggestions.slice(0, maxSuggestions);

  return (
    <motion.div
      className={clsx(
        "overflow-y-auto overscroll-contain",
        "scrollbar-thin scrollbar-thumb-PDCL-green/30 hover:scrollbar-thumb-PDCL-green/50 scrollbar-track-transparent",
        shouldScroll && "pr-2"
      )}
      style={{
        scrollbarWidth: 'thin',
        maxHeight: `${Math.min(window.innerHeight * 0.4, isXSmallScreen ? 160 : isSmallScreen ? 200 : 280)}px`,
        overflow: 'visible' // Horizontal visible for drag extension
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}>

      {/* Container gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 pointer-events-none rounded-xl" />

      <AnimatePresence mode="popLayout">
        {visibleSuggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.action}
            suggestion={suggestion}
            isXSmallScreen={isXSmallScreen}
            isSmallScreen={isSmallScreen}
            navigate={navigate}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>

      {/* Enhanced remaining count indicator */}
      {suggestions.length > maxSuggestions && (
        <motion.div
          className="mr-4 mb-2 p-2 glass rounded-xl text-center font-ubuntu relative overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 102, 66, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 102, 66, 0.1)'
          }}>
          <motion.div
            className="text-xs text-PDCL-green font-medium flex items-center justify-center gap-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <SparklesIcon className="w-3 h-3" />
            <span>+{suggestions.length - maxSuggestions} more smart suggestions</span>
            <SparklesIcon className="w-3 h-3" />
          </motion.div>

          {/* Subtle animated border */}
          <motion.div
            className="absolute inset-0 rounded-xl border border-PDCL-green/20"
            animate={{
              borderColor: ['rgba(0, 102, 66, 0.1)', 'rgba(0, 102, 66, 0.3)', 'rgba(0, 102, 66, 0.1)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

const SmartSidemenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set());
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [maxLabelWidth, setMaxLabelWidth] = useState(0);

  const navigate = useNavigate();
  const { direction, y } = useScrollPosition();
  const { contextualActions, emergencyMode, trackAction, getSmartSuggestions } = useSmartNavigation();

  // Viewport resize handler
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate safe positioning based on content and viewport
  const getSafePositioning = () => {
    const suggestions = getSmartSuggestions.filter(
      suggestion => !dismissedSuggestions.has(suggestion.action)
    );

    // Enhanced responsive sizing with better breakpoints
    const isXSmallScreen = window.innerWidth < 480;
    const isSmallScreen = window.innerWidth < 768;
    const isMediumScreen = window.innerWidth < 1024;

    const baseActionHeight = isXSmallScreen ? 45 : isSmallScreen ? 55 : 65;
    const baseSuggestionHeight = isXSmallScreen ? 75 : isSmallScreen ? 85 : 95;
    const maxSuggestionsHeight = isXSmallScreen ? 120 : isSmallScreen ? 180 : 250;

    const suggestionHeight = Math.min(suggestions.length * baseSuggestionHeight, maxSuggestionsHeight);
    const actionsHeight = contextualActions.length * baseActionHeight;
    const padding = isXSmallScreen ? 40 : isSmallScreen ? 70 : 100;
    const totalHeight = suggestionHeight + actionsHeight + padding;

    // Ensure menu doesn't go beyond viewport boundaries with better mobile handling.
    // Reserve clearance for the sticky top navbar.
    const minTop = isXSmallScreen ? 90 : 120;
    const maxTop = Math.max(minTop, viewportHeight - totalHeight - (isXSmallScreen ? 10 : 20));
    const centeredTop = (viewportHeight - totalHeight) / 2;
    const safeTop = Math.max(minTop, Math.min(centeredTop, maxTop));

    return {
      top: `${safeTop}px`,
      maxSuggestions: Math.min(suggestions.length, isXSmallScreen ? 1 : isSmallScreen ? 2 : isMediumScreen ? 3 : 4),
      shouldScroll: suggestions.length > (isXSmallScreen ? 1 : isSmallScreen ? 2 : isMediumScreen ? 3 : 4),
      isXSmallScreen,
      isSmallScreen,
      isMediumScreen
    };
  };

  // Auto-collapse when user scrolls up significantly
  useEffect(() => {
    if (direction === 'up' && y > 200) {
      setIsExpanded(false);
    }
  }, [direction, y]);

  // Calculate maximum label width when expanded (simplified without canvas)
  useEffect(() => {
    if (isExpanded && contextualActions.length > 0) {
      // Use simple character-based estimation instead of canvas
      const maxWidth = Math.max(
        ...contextualActions.slice(0, 6).map(action =>
          Math.min(action.label.length * 8 + 40, 220) // 8px per char + padding
        ),
        120 // Minimum width to ensure toggle doesn't get too close
      );
      setMaxLabelWidth(maxWidth);
    } else {
      setMaxLabelWidth(0);
    }
  }, [isExpanded, contextualActions]);

  const handleDismissSuggestion = (action) => {
    setDismissedSuggestions(prev => new Set([...prev, action]));
  };

  const {
    top: safeTop,
    maxSuggestions,
    shouldScroll,
    isXSmallScreen,
    isSmallScreen,
  } = getSafePositioning();
  const activeSuggestions = getSmartSuggestions.filter(
    suggestion => !dismissedSuggestions.has(suggestion.action)
  );
  const hasActions = contextualActions.length > 0;

  return (
    <>
      {/* Smart Suggestions */}
      {hasActions && (
        <motion.div
          className="fixed z-30 hidden sm:block"
          style={{
            top: safeTop,
            right: '16px', // Simple viewport-edge positioning
          }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}>
          <SmartSuggestions
            suggestions={activeSuggestions}
            maxSuggestions={maxSuggestions}
            shouldScroll={shouldScroll}
            isXSmallScreen={isXSmallScreen}
            isSmallScreen={isSmallScreen}
            navigate={navigate}
            onDismiss={handleDismissSuggestion}
          />
        </motion.div>
      )}

      {/* Contextual Actions Panel - Positioned at viewport edge */}
      {hasActions && (
      <motion.div
        className="fixed z-30 hidden sm:block"
        style={{
          top: `calc(${safeTop} + ${activeSuggestions.length > 0 ?
            (isXSmallScreen ? '180px' : isSmallScreen ? '220px' : '280px')
            : '0px'})`,
          right: '16px', // Simple viewport-edge positioning
        }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}>

        <div className="relative">
          {/* Expand/Collapse Toggle - Dynamic positioning based on expansion state */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-1/2 -translate-y-1/2 p-2 glass rounded-full shadow-depth-2 text-PDCL-green hover:text-PDCL-green-light transition-colors duration-200 z-10"
            animate={{
              left: isExpanded ? `${-(maxLabelWidth + 16)}px` : '-40px', // 16px for proper spacing from labels
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            style={getGlassStyle('medical', 0.9)}
            aria-label={isExpanded ? "Collapse menu" : "Expand menu"}>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}>
              <SparklesIcon className="w-4 h-4" />
            </motion.div>
          </motion.button>

          <motion.div
            className="space-y-3"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}>

          <AnimatePresence>
            {contextualActions.slice(0, 6).map((action, index) => (
              <SmartActionButton
                key={action.id}
                action={action}
                index={index}
                isExpanded={isExpanded}
                emergencyMode={emergencyMode}
                trackAction={trackAction}
              />
            ))}
          </AnimatePresence>
          </motion.div>
        </div>

        {/* AI Indicator */}
        <motion.div
          className="mt-4 mr-2 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}>
          <div className="text-xs text-gray-500 font-ubuntu flex items-center justify-end gap-1">
            <SparklesIcon className="w-3 h-3" />
            Smart Actions
          </div>
        </motion.div>
      </motion.div>
      )}
    </>
  );
};

export default SmartSidemenu;
