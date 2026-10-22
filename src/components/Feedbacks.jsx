import React, { useCallback } from "react";
import { SectionWrapper } from "../hoc";
import "@fontsource/ubuntu";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { API_TOKEN, BASE_URL } from "../secrets";

// Custom hooks and components
import { useHealthcareApi } from "../hooks/useApiCall";
import { TestimonialSkeleton, SpinnerLoader } from "./ui/LoadingSkeleton";
import { ApiErrorDisplay, withErrorBoundary } from "./ui/ErrorBoundary";
import { TestimonialAvatar } from "./ui/ImageWithFallback";

// Constants for consistent configuration
const API_CONFIG = {
  url: `${BASE_URL}/api/testimonials`,
  params: { token: `${API_TOKEN}` },
};

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};


const CONTAINER_VARIANTS = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const ITEM_VARIANTS = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Enhanced testimonial card with improved accessibility and error handling
 */
const FeedbackCard = React.memo(
  ({ comment, person, designation, company, image }) => {
    const createMarkup = useCallback((html) => ({ __html: html }), []);

    const displayDesignation = useCallback(() => {
      if (!designation || designation === "N/A" || designation === "NA") {
        return company || "Valued Client";
      }
      return company ? `${designation}, ${company}` : designation;
    }, [designation, company]);

    // Clean and truncate comment for better display
    const getCleanComment = useCallback(() => {
      if (!comment) return "No comment provided";
      
      // Remove excessive HTML and limit length for better UX
      const cleanText = comment.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanText.length > 300) {
        return cleanText.substring(0, 300) + '...';
      }
      return cleanText;
    }, [comment]);

    return (
      <div className="sm:w-[550px] w-full shadow-lg">
        <motion.div 
          whileHover={{ scale: 1.02, y: -4 }} 
          className="h-full"
          variants={ITEM_VARIANTS}>
          <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-[#00984a]/30 transition-all duration-300">
            <div className="p-6 pb-0 flex items-center gap-4">
              <div className="relative">
                <TestimonialAvatar
                  src={image}
                  personName={person}
                  className="w-full rounded-3xl border-4 border-[#00984a]/20"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#00984a] text-white rounded-full p-1">
                  <FaQuoteLeft className="text-xs" />
                </div>
              </div>
              <div>
                <h3 className="text-gray-800 font-bold text-lg">{person || "Anonymous"}</h3>
                <p className="text-[#00984a] text-sm font-medium">
                  {displayDesignation()}
                </p>
              </div>
            </div>

            <div className="p-6 pt-4">
              <div className="relative">
                <FaQuoteLeft className="absolute -top-2 -left-2 text-gray-200 text-xl" />
                <div
                  className="text-gray-600 font-ubuntu text-[16px] leading-relaxed italic pl-4"
                  dangerouslySetInnerHTML={createMarkup(getCleanComment())}
                />
                <FaQuoteRight className="absolute -bottom-2 -right-2 text-gray-200 text-xl" />
              </div>
            </div>

            <div className="h-2 bg-gradient-to-r from-[#00984a] to-[#4ade80]"></div>
          </div>
        </motion.div>
      </div>
    );
  }
);

FeedbackCard.displayName = "FeedbackCard";

/**
 * Main Feedbacks component with enhanced error handling and user experience
 */
const Feedbacks = () => {
  // Enhanced API call with proper error handling and data transformation
  const {
    data: testimonials,
    loading,
    error,
    retry,
    isRetrying,
  } = useHealthcareApi(API_CONFIG.url, {
    params: API_CONFIG.params,
    autoFetch: true,
    maxRetries: 3,
    transform: (data) => {
      // Ensure we have an array of testimonials with proper structure
      if (!Array.isArray(data)) return [];
      
      return data
        .filter(testimonial => testimonial.person && testimonial.comment) // Filter out incomplete testimonials
        .map((testimonial, index) => ({
          ...testimonial,
          // Ensure unique keys and proper fallbacks
          key: `${testimonial.person}-${testimonial.company}-${index}`,
          person: testimonial.person || "Anonymous",
          company: testimonial.company || "",
          designation: testimonial.designation || "",
          comment: testimonial.comment || "No comment provided",
          image: testimonial.image || "/api/placeholder-avatar.png", // Fallback image
        }));
    },
  });

  // Render loading state with skeleton
  const renderLoadingState = () => (
    <div className="py-8">
      <TestimonialSkeleton count={4} />
    </div>
  );

  // Render error state with retry option
  const renderErrorState = () => (
    <ApiErrorDisplay
      error={error}
      onRetry={retry}
      retryLabel={isRetrying ? "Retrying..." : "Reload Testimonials"}
      className="py-12"
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="text-[#00984a] mb-4">
        <svg
          className="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No testimonials available
      </h3>
      <p className="text-gray-600">
        Check back soon to see what our clients are saying about us.
      </p>
    </div>
  );

  // Render testimonials grid
  const renderTestimonials = () => (
    <motion.div
      variants={CONTAINER_VARIANTS}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className="flex mx-auto p-0 justify-center justify-items-center flex-wrap gap-8 lg:gap-10">
      {testimonials.map((testimonial) => (
        <FeedbackCard
          key={testimonial.key}
          {...testimonial}
        />
      ))}
    </motion.div>
  );

  // Main render logic
  const renderContent = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!testimonials || testimonials.length === 0) return renderEmptyState();
    return renderTestimonials();
  };

  return (
    <section className="bg-none" aria-labelledby="testimonials-heading">
      <motion.h2
        id="testimonials-heading"
        initial={CARD_ANIMATION.initial}
        whileInView={CARD_ANIMATION.animate}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center text-[#00984a] font-bold mt-20 mb-12 font-ubuntu text-3xl">
        What Our Clients Say
      </motion.h2>

      {renderContent()}

      {/* Global retry indicator */}
      {isRetrying && (
        <div 
          className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-[#00984a]/20"
          role="status"
          aria-live="polite">
          <div className="flex items-center gap-3">
            <SpinnerLoader size="small" />
            <span className="text-sm text-gray-600">Loading testimonials...</span>
          </div>
        </div>
      )}
    </section>
  );
};

// Export component with error boundary
export default SectionWrapper(withErrorBoundary(Feedbacks, "Client Testimonials"), "");