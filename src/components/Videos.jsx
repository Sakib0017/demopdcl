import "@fontsource/ubuntu";
import { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player/youtube";
import { FiPlay, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Videos = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const sectionsRef = useRef([]);

  const videoUrls = [
    {
      url: "https://www.youtube.com/watch?v=OoEcHuLVqMo",
      title: "Corporate Overview",
      description: "Discover our mission and values",
    },
    {
      url: "https://www.youtube.com/watch?v=0sAkXLU-W0k",
      title: "Popular Pharmaceuticals",
      description: "Quality pharmaceutical manufacturing",
    },
    {
      url: "https://www.youtube.com/watch?v=oChQH0QcUZQ",
      title: "Popular Ophthalmics",
      description: "Eye care and ophthalmic solutions",
    },
    {
      url: "https://www.youtube.com/watch?v=kDEaE-Cra7s",
      title: "Popular Cephalosporins",
      description: "Antibiotic medications and treatments",
    },
  ];

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
  }, []);

  const openLightbox = (index) => {
    setCurrentVideoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigateVideos = useCallback((direction) => {
    setCurrentVideoIndex((prevIndex) => {
      if (direction === "prev") {
        return (prevIndex - 1 + videoUrls.length) % videoUrls.length;
      } else {
        return (prevIndex + 1) % videoUrls.length;
      }
    });
  }, [videoUrls.length]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") navigateVideos("prev");
        if (e.key === "ArrowRight") navigateVideos("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, navigateVideos]);

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen overflow-x-hidden">
      {/* Mobile-first hero section with iOS safe areas */}
      <section 
        className="relative pt-16 pb-8 px-4 sm:pt-20 sm:pb-12 md:pt-28 md:pb-16 lg:px-8 max-w-7xl mx-auto"
        style={{ paddingTop: "max(4rem, env(safe-area-inset-top))" }}
      >
        <div 
          className="text-center max-w-4xl mx-auto scroll-fade" 
          ref={(el) => (sectionsRef.current[0] = el)}
        >
          {/* Mobile-first typography scaling */}
          <h1 className="text-3xl leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu">
            Our{" "}
            <span className="text-PDCL-green-light bg-gradient-to-r from-PDCL-green-light to-PDCL-green bg-clip-text text-transparent">
              Corporate Videos
            </span>
          </h1>
          
          {/* Mobile-optimized paragraph */}
          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 font-light px-2 sm:px-0 font-ubuntu">
            Discover our healthcare excellence through these featured videos showcasing our commitment to quality care and innovation.
          </p>
        </div>
      </section>

      {/* Mobile-first videos grid section */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 max-w-7xl mx-auto">
        <div 
          className="scroll-fade" 
          ref={(el) => (sectionsRef.current[1] = el)}
        >

          {/* Mobile-first video grid with glassmorphism */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {videoUrls.map((video, index) => (
              <div
                key={index}
                className="glass-medical rounded-2xl sm:rounded-3xl shadow-depth-2 sm:shadow-depth-3 overflow-hidden group hover-lift transition-all duration-500 cursor-pointer touch-manipulation"
                onClick={() => openLightbox(index)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Video container with mobile-first aspect ratio */}
                <div className="relative w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                  <div className="relative w-full pt-[56.25%] bg-gray-100">
                    <ReactPlayer
                      url={video.url}
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                      light={true}
                      playIcon={
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-PDCL-green-light hover:bg-PDCL-green bg-opacity-95 rounded-full p-4 sm:p-6 text-white transform group-hover:scale-110 transition-all duration-300 shadow-depth-2 touch-manipulation min-h-[56px] min-w-[56px] flex items-center justify-center">
                            <FiPlay className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
                          </div>
                        </div>
                      }
                      style={{ WebkitBackfaceVisibility: "hidden" }}
                    />
                    
                    {/* Enhanced overlay for mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Content section with mobile-first design */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-grow">
                      <h3 className="text-gray-900 font-bold font-ubuntu text-lg sm:text-xl lg:text-2xl mb-2 leading-tight group-hover:text-PDCL-green-light transition-colors duration-300">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 font-ubuntu text-sm sm:text-base leading-relaxed group-hover:text-PDCL-green transition-colors duration-300">
                        {video.description}
                      </p>
                    </div>
                    
                    {/* Play indicator for mobile */}
                    <div className="ml-3 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-PDCL-green-light/10 rounded-full flex items-center justify-center">
                        <FiPlay className="w-4 h-4 sm:w-5 sm:h-5 text-PDCL-green-light ml-0.5" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile-first watch button */}
                  <div className="flex items-center justify-between">
                    <span className="text-PDCL-green-light font-semibold text-sm sm:text-base font-ubuntu group-hover:text-PDCL-green transition-colors duration-300">
                      Watch Video
                    </span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-PDCL-green-light to-PDCL-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced mobile-first lightbox with iOS optimizations */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-2 sm:p-4"
          style={{ 
            paddingTop: "max(0.5rem, env(safe-area-inset-top))",
            paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
            paddingRight: "max(0.5rem, env(safe-area-inset-right))"
          }}
        >
          {/* Mobile-first close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close video"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Mobile-first navigation buttons */}
          <button
            onClick={() => navigateVideos("prev")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 sm:left-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous video"
          >
            <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => navigateVideos("next")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 sm:right-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next video"
          >
            <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Mobile-first video container */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <ReactPlayer
                url={videoUrls[currentVideoIndex].url}
                width="100%"
                height="100%"
                controls
                playing={lightboxOpen}
                className="rounded-lg sm:rounded-xl overflow-hidden"
                style={{ 
                  borderRadius: "0.5rem",
                  WebkitBackfaceVisibility: "hidden"
                }}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                    }
                  }
                }}
              />
            </div>
            
            {/* Mobile-first video info */}
            <div className="absolute -bottom-16 sm:-bottom-20 left-0 right-0 text-center text-white px-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-ubuntu mb-1 sm:mb-2">
                {videoUrls[currentVideoIndex].title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base font-ubuntu mb-2">
                {videoUrls[currentVideoIndex].description}
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400">
                <span>{currentVideoIndex + 1} of {videoUrls.length}</span>
                <span>•</span>
                <span>Use arrow keys to navigate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing with iOS safe area */}
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

export default Videos;
