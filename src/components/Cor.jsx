import React from "react";
import "@fontsource/ubuntu";
import { servicePartners } from "../constants/homepage";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { API_TOKEN, BASE_URL } from "../secrets";

// Custom hooks and components
import { useHealthcareApi } from "../hooks/useApiCall";
import { PartnerSkeleton, SpinnerLoader } from "./ui/LoadingSkeleton";
import { ApiErrorDisplay, withErrorBoundary } from "./ui/ErrorBoundary";
import { PartnerLogo } from "./ui/ImageWithFallback";

// Animation variants
const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

/**
 * Corporate Partners Component
 * Displays healthcare organization's corporate and service partners
 * with proper error handling and accessibility features
 */
function Cor() {
  // Fetch corporate partners data with proper error handling
  const {
    data: corporatePartners,
    loading: corporateLoading,
    error: corporateError,
    retry: retryCorporatePartners,
    isRetrying: isRetryingCorporate,
  } = useHealthcareApi(`${BASE_URL}/api/partners`, {
    params: { token: API_TOKEN },
    autoFetch: true,
    transform: (data) => {
      // Ensure we have an array of partners with proper structure
      if (!Array.isArray(data)) return [];
      
      return data.map((partner, index) => ({
        id: partner.id || `partner-${index}`,
        image: partner.image,
        name: partner.name || `Partner ${partner.id || index + 1}`,
        // Add alt text for accessibility
        alt: partner.alt || `${partner.name || 'Corporate partner'} logo`,
      }));
    },
  });


  // Render corporate partners section
  const renderCorporatePartners = () => {
    if (corporateLoading) {
      return (
        <div className="my-8">
          <PartnerSkeleton count={6} />
        </div>
      );
    }

    if (corporateError) {
      return (
        <ApiErrorDisplay
          error={corporateError}
          onRetry={retryCorporatePartners}
          retryLabel={isRetryingCorporate ? "Retrying..." : "Reload Partners"}
          className="my-8"
        />
      );
    }

    if (!corporatePartners || corporatePartners.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-medium mb-2">No corporate partners available</div>
          <div className="text-sm">Please check back later for updates.</div>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="my-8 w-full">
        <Marquee 
          gradient={false} 
          speed={40}
          pauseOnHover={true}
          className="py-4 w-full"
          style={{ width: '100%' }}
          aria-label="Corporate partners carousel">
          {corporatePartners.map((partner) => (
            <div key={partner.id} className="mx-3 sm:mx-6 md:mx-8 lg:mx-10">
              <img
                src={partner.image}
                alt={partner.alt || `Image ${partner.id}`}
                className="h-12 w-auto sm:h-16 md:h-18 lg:h-20 object-contain transition-all duration-300 hover:scale-105 hover:brightness-110 filter grayscale-0"
                loading="lazy"
              />
            </div>
          ))}
        </Marquee>
      </motion.div>
    );
  };

  // Render service partners section
  const renderServicePartners = () => {
    if (!servicePartners || servicePartners.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg font-medium mb-2">No service partners available</div>
          <div className="text-sm">Please check back later for updates.</div>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-wrap p-5 gap-4 max-w-screen-xl mx-auto justify-center">
        {servicePartners.map((partner) => (
          <motion.div
            key={partner.id}
            variants={itemVariants}
            className="w-full sm:w-[300px] p-5 h-28 flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}>
            <PartnerLogo
              src={partner.icon}
              alt={`${partner.name} service partner logo`}
              companyName={partner.name}
              className="max-w-full max-h-full w-auto h-auto object-contain filter hover:brightness-110 transition-all duration-300"
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="mt-[150px] -mb-[10px]" role="region" aria-label="Partner organizations">
      {/* Corporate Partners Section */}
      <section aria-labelledby="corporate-partners-heading">
        <motion.h2
          id="corporate-partners-heading"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center text-[#00984a] font-bold mb-8 font-ubuntu text-3xl">
          Corporate Partners
        </motion.h2>

        <div className="w-full overflow-hidden">
          {renderCorporatePartners()}
        </div>
      </section>

      {/* Service Partners Section */}
      <section 
        className="mt-20 border border-[#00984a]/30 bg-gray-100 rounded-3xl"
        aria-labelledby="service-partners-heading">
        <motion.h2
          id="service-partners-heading"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center text-[#00984a] font-bold pt-8 mb-8 font-ubuntu text-3xl">
          Service Partners
        </motion.h2>

        {renderServicePartners()}
      </section>

      {/* Loading indicator for retrying corporate partners */}
      {isRetryingCorporate && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-[#00984a]/20">
          <div className="flex items-center gap-3">
            <SpinnerLoader size="small" />
            <span className="text-sm text-gray-600">Retrying partners...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export component with error boundary
export default withErrorBoundary(Cor, "Corporate Partners");