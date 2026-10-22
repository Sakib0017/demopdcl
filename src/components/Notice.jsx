import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/ubuntu";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import axios from "axios";
import { API_TOKEN, BASE_URL } from "../secrets";

const SkeletonLoader = () => (
  <div className="glass-medical rounded-2xl sm:rounded-3xl w-full h-full shadow-depth-1 animate-pulse flex flex-col">
    <div className="relative w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl flex-shrink-0">
      <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-200 p-2 rounded-2xl sm:rounded-3xl" />
    </div>
    <div className="p-4 sm:p-6 lg:p-7 text-center space-y-3 flex-grow flex flex-col justify-center">
      <div className="h-5 sm:h-6 bg-gray-200 rounded mx-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  </div>
);

const ProjectCard = ({ id, title, image, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const isValidImage =
    image?.trim() && image !== "https://populardiagnostic.com/public/news/";

  const handleClick = useCallback(() => {
    navigate(`/notices/${id}`);
  }, [id, navigate]);

  return (
    <div
      className="glass-medical rounded-2xl sm:rounded-3xl w-full h-full shadow-depth-2 transition-all duration-500 hover-lift group touch-manipulation relative lg:hover:z-50 lg:hover:scale-105 lg:hover:shadow-depth-5 flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      {/* Image section with glassmorphism */}
      <div className="relative w-full overflow-hidden p-2 rounded-t-2xl sm:rounded-t-3xl flex-shrink-0">
        <div className="relative w-full h-48 sm:h-56 lg:h-64 bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
          {(!imgLoaded || imgError || !isValidImage) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {isValidImage && (
            <img
              src={image}
              alt={`${title} - Notice from Popular Diagnostic Centre`}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 rounded-2xl sm:rounded-3xl ${
                !imgLoaded ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
              style={{ WebkitBackfaceVisibility: "hidden" }}
            />
          )}
          
          {/* Subtle overlay for better text readability on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-PDCL-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>
          
          {/* Notice badge */}
          <div className="absolute top-3 right-3 bg-PDCL-green-light text-white px-2 py-1 rounded-full text-xs font-medium opacity-90">
            Notice
          </div>
        </div>
      </div>
      
      {/* Content section with glassmorphism transparency */}
      <div className="p-4 sm:p-6 lg:p-7 flex-grow flex flex-col justify-between relative">
        <div className="flex-grow">
          <h3 className="text-gray-900 font-bold font-ubuntu text-lg sm:text-xl mb-3 leading-tight group-hover:text-PDCL-green-light transition-colors duration-300 line-clamp-3">
            {title}
          </h3>
        </div>
        
        {/* Enhanced view details section */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-PDCL-green-light font-semibold text-sm sm:text-base font-ubuntu group-hover:text-PDCL-green transition-colors duration-300">
            View Details
          </span>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-PDCL-green-light to-PDCL-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 lg:group-hover:w-16 h-1 bg-gradient-to-r from-PDCL-green-light to-PDCL-green rounded-full transition-all duration-300"></div>
      </div>
    </div>
  );
};

const MarqueeNoticeTitles = ({ notices, onTitleClick }) => (
  <div className="bg-PDCL-green text-white py-4 sm:py-5 mb-8 sm:mb-12 overflow-hidden shadow-depth-2">
    <div className="flex items-center">
      <span className="font-bold font-ubuntu px-4 sm:px-6 whitespace-nowrap text-sm sm:text-base">
        Latest Notices:
      </span>
      <div className="overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: notices.length * 5,
            repeat: Infinity,
            ease: "linear",
          }}>
          {notices.map((notice, index) => (
            <div key={notice.id} className="flex items-center">
              <span
                className="px-3 sm:px-4 cursor-pointer hover:underline hover:text-green-200 transition-colors duration-300 text-sm sm:text-base font-ubuntu touch-manipulation"
                onClick={() => onTitleClick(notice)}>
                {notice.title}
              </span>
              {index < notices.length - 1 && (
                <span className="px-2 sm:px-3 text-green-200">•</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);

const Pagination = ({ pagination, onPageChange }) => {
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const { current_page, last_page } = pagination;

    if (last_page <= maxVisiblePages) {
      for (let i = 1; i <= last_page; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-ubuntu font-medium text-sm sm:text-base transition-all duration-300 touch-manipulation flex items-center justify-center ${
              i === current_page
                ? "bg-PDCL-green-light text-white shadow-depth-2 transform scale-110"
                : "glass-medical text-gray-700 hover:text-PDCL-green-light hover:bg-PDCL-green-light/10"
            }`}>
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      buttons.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-4 py-2 rounded-md ${
            1 === current_page
              ? "bg-[#007a3d] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          1
        </button>
      );

      // Show ellipsis if current page is not near start
      if (current_page > 3) {
        buttons.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }

      // Show pages around current page
      const start = Math.max(2, current_page - 1);
      const end = Math.min(last_page - 1, current_page + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-ubuntu font-medium text-sm sm:text-base transition-all duration-300 touch-manipulation flex items-center justify-center ${
              i === current_page
                ? "bg-PDCL-green-light text-white shadow-depth-2 transform scale-110"
                : "glass-medical text-gray-700 hover:text-PDCL-green-light hover:bg-PDCL-green-light/10"
            }`}>
            {i}
          </button>
        );
      }

      // Show ellipsis if current page is not near end
      if (current_page < last_page - 2) {
        buttons.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }

      // Always show last page
      buttons.push(
        <button
          key={last_page}
          onClick={() => onPageChange(last_page)}
          className={`px-4 py-2 rounded-md ${
            last_page === current_page
              ? "bg-[#007a3d] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
          {last_page}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex justify-center mt-8 sm:mt-12 px-4">
      <nav className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-full font-ubuntu font-medium text-sm sm:text-base transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
            pagination.current_page === 1
              ? "glass-medical text-gray-500 cursor-not-allowed opacity-50"
              : "bg-PDCL-green text-white hover:bg-PDCL-green-light shadow-depth-2 hover:shadow-depth-3"
          }`}>
          Previous
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {renderPageButtons()}
        </div>

        <button
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.last_page}
          className={`px-3 py-2 sm:px-4 sm:py-3 rounded-full font-ubuntu font-medium text-sm sm:text-base transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${
            pagination.current_page === pagination.last_page
              ? "glass-medical text-gray-500 cursor-not-allowed opacity-50"
              : "bg-PDCL-green text-white hover:bg-PDCL-green-light shadow-depth-2 hover:shadow-depth-3"
          }`}>
          Next
        </button>
      </nav>
    </div>
  );
};

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="w-full py-12 px-4 text-center">
    <div className="glass-medical rounded-2xl p-6 sm:p-8 max-w-md mx-auto border-l-4 border-red-400">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-ubuntu text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 font-ubuntu text-base sm:text-lg font-medium leading-relaxed mb-6">{error}</p>
      <button 
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 touch-manipulation min-h-[44px] font-ubuntu shadow-depth-2 hover:shadow-depth-3"
      >
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 sm:py-16">
    <div className="glass-medical rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold font-ubuntu text-gray-900 mb-3">
        No notices found
      </h3>
      <p className="text-gray-500 font-ubuntu text-base sm:text-lg leading-relaxed">
        There are currently no notices available. Please check back later for updates.
      </p>
    </div>
  </div>
);

function Notice() {
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  // Mobile-first scroll animation observer with iOS optimizations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // iOS performance optimization
            entry.target.style.transform = 'translateZ(0)';
          }
        });
      },
      { 
        threshold: prefersReducedMotion ? 0.3 : 0.1, 
        rootMargin: '30px'
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [loading]); // Re-run when loading changes

  const handleNoticeClick = useCallback(
    (notice) => {
      navigate(`/notices/${notice.id}`, { state: { notice } });
    },
    [navigate]
  );

  const handleDownloadImage = useCallback(async (notice) => {
    if (
      !notice.image?.trim() ||
      notice.image === "https://populardiagnostic.com/public/news/"
    ) {
      return;
    }

    try {
      const response = await fetch(notice.image);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const filename = `${notice.title.replace(/\s+/g, "_")}.${
        blob.type.split("/")[1] || "jpg"
      }`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(notice.image, "_blank");
    }
  }, []);

  const fetchNotices = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/news-and-notices`, {
        params: {
          token: `${API_TOKEN}`,
          page,
        },
      });

      setNotices(response.data.data.data);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
      });
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error fetching notices:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= pagination.last_page) {
        fetchNotices(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [fetchNotices, pagination.last_page]
  );

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => fetchNotices(1)} />;
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen overflow-x-hidden">
      {/* Mobile-first hero section with iOS safe areas */}
      <section 
        className="relative pt-16 pb-8 px-4 sm:pt-20 sm:pb-12 md:pt-28 md:pb-16 lg:px-8 max-w-7xl mx-auto"
        style={{ paddingTop: "max(4rem, env(safe-area-inset-top))" }}
      >
        <motion.div 
          variants={textVariant()}
          className="text-center max-w-4xl mx-auto scroll-fade" 
          ref={(el) => (sectionsRef.current[0] = el)}
        >
          {/* Mobile-first typography scaling */}
          <h1 className="text-3xl leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu">
            <span className="text-PDCL-green-light bg-gradient-to-r from-PDCL-green-light to-PDCL-green bg-clip-text text-transparent">
              KEEPING YOU INFORMED
            </span>
          </h1>
          
          {/* Mobile-optimized paragraph */}
          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 font-light px-2 sm:px-0 font-ubuntu">
            Stay updated with the latest news, announcements, and important notices from Popular Diagnostic Centre Ltd.
          </p>
        </motion.div>
      </section>

      {/* Enhanced marquee section */}
      {!loading && notices.length > 0 && (
        <MarqueeNoticeTitles
          notices={notices}
          onTitleClick={handleDownloadImage}
        />
      )}

      {/* Mobile-first notices grid section */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 max-w-7xl mx-auto">
        <div 
          className="scroll-fade" 
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          {loading && pagination.current_page === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="w-full h-[400px] sm:h-[450px] lg:h-[500px]">
                  <SkeletonLoader />
                </div>
              ))}
            </div>
          ) : (
            <>
              {notices.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                    {notices.map((notice, index) => (
                      <div 
                        key={notice.id} 
                        className="w-full h-[400px] sm:h-[450px] lg:h-[500px]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProjectCard
                          {...notice}
                          onClick={() => handleNoticeClick(notice)}
                        />
                      </div>
                    ))}
                  </div>

                  {pagination.last_page > 1 && (
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Bottom spacing with iOS safe area */}
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
}

export default Notice;
