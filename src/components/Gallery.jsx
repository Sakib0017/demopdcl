import "@fontsource/ubuntu";
import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { API_TOKEN, BASE_URL } from "../secrets";
import { useBranchCounts } from "../hooks/useBranchCounts";

const Gallery = () => {
  const { totalBranches } = useBranchCounts();
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  }, [isLoading]); // Re-run when loading changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/gallery`, {
          params: {
            token: `${API_TOKEN}`,
          },
        });

        setTabs(response.data.data);
        if (response.data.data?.length > 0) {
          setActiveTab(response.data.data[0].id);
        }
      } catch (err) {
        setError("Failed to load gallery. Please try again later.");
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error("Gallery fetch error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = useCallback((id) => {
    setActiveTab(id);
    setCurrentImageIndex(0);
  }, []);

  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; 
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const navigateImages = useCallback(
    (direction) => {
      const activeTabContent = tabs.find((tab) => tab.id === activeTab);
      if (!activeTabContent) return;

      setCurrentImageIndex((prevIndex) => {
        if (direction === "prev") {
          return (
            (prevIndex - 1 + activeTabContent.media.length) %
            activeTabContent.media.length
          );
        } else {
          return (prevIndex + 1) % activeTabContent.media.length;
        }
      });
    },
    [activeTab, tabs]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (lightboxOpen) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") navigateImages("prev");
        if (e.key === "ArrowRight") navigateImages("next");
      }
    },
    [lightboxOpen, closeLightbox, navigateImages]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

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
              Gallery
            </span>
          </h1>
          
          {/* Mobile-optimized paragraph */}
          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 font-light px-2 sm:px-0 font-ubuntu">
            Explore moments from our healthcare journey and witness the excellence in our facilities and services.
          </p>
          
          {/* Gallery stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto mb-8">
            {[
              { number: `${tabs.length}`, label: "Categories" },
              { number: "1000+", label: "Images" },
              { number: `${totalBranches}+`, label: "Branches" },
              { number: "40+", label: "Years" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-3 sm:p-4 glass-medical rounded-xl hover-lift group transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-PDCL-green-light mb-1 group-hover:text-PDCL-green transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm font-medium leading-tight font-ubuntu">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-first gallery content section */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 max-w-7xl mx-auto">
        <div 
          className="scroll-fade" 
          ref={(el) => (sectionsRef.current[1] = el)}
        >

          {/* Mobile-first tab navigation with glassmorphism */}
          <div className="overflow-x-auto pb-4 mb-8 sm:mb-12 scrollbar-hide">
            <div className="inline-flex space-x-2 sm:space-x-4 px-2">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 sm:h-12 w-24 sm:w-32 glass-medical rounded-full animate-pulse"></div>
                ))
              ) : error ? (
                <div className="w-full py-8 px-4 text-center">
                  <div className="glass-medical rounded-2xl p-6 sm:p-8 max-w-md mx-auto border-l-4 border-red-400">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-red-600 font-ubuntu text-base sm:text-lg font-medium leading-relaxed">{error}</p>
                  </div>
                </div>
              ) : (
                tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    className={`py-3 px-5 sm:px-6 text-sm sm:text-base font-medium font-ubuntu rounded-full transition-all duration-300 whitespace-nowrap touch-manipulation min-h-[44px] ${
                      activeTab === tab.id
                        ? "bg-PDCL-green-light text-white shadow-depth-2 transform scale-105"
                        : "glass-medical text-gray-700 hover:text-PDCL-green-light hover:bg-PDCL-green-light/10 border border-gray-200/50"
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {tab.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Mobile-first image grid with glassmorphism */}
          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square glass-medical rounded-xl sm:rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : activeTabContent?.media?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {activeTabContent.media.map((mediaItem, index) => (
                  <div
                    key={mediaItem.id}
                    className="group relative overflow-hidden glass-medical rounded-xl sm:rounded-2xl shadow-depth-2 hover:shadow-depth-3 hover-lift transition-all duration-500 aspect-square cursor-pointer touch-manipulation"
                    onClick={() => openLightbox(index)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img
                      src={mediaItem.file}
                      alt={`Gallery item ${index + 1} - ${activeTabContent.name}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      style={{ WebkitBackfaceVisibility: "hidden" }}
                    />
                    
                    {/* Enhanced mobile-first overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-PDCL-green/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    {/* Mobile-first view indicator */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-PDCL-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    
                    {/* Mobile-first image counter */}
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/70 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {index + 1} / {activeTabContent.media.length}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="glass-medical rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-ubuntu text-base sm:text-lg font-medium">
                    No images found in this category
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced mobile-first lightbox with iOS optimizations */}
      {lightboxOpen && activeTabContent && (
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
            aria-label="Close lightbox"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Mobile-first navigation buttons */}
          <button
            onClick={() => navigateImages("prev")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 sm:left-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => navigateImages("next")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 sm:right-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Mobile-first image container */}
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={activeTabContent.media[currentImageIndex].file}
              alt={`Gallery image ${currentImageIndex + 1} - ${activeTabContent.name}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg sm:rounded-xl"
              style={{ WebkitBackfaceVisibility: "hidden" }}
            />
          </div>

          {/* Mobile-first image info */}
          <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center text-white px-4">
            <div className="glass-medical rounded-full px-4 py-2 sm:px-6 sm:py-3 inline-block">
              <div className="text-sm sm:text-base font-medium font-ubuntu mb-1">
                {activeTabContent.name}
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-300">
                <span>{currentImageIndex + 1} of {activeTabContent.media.length}</span>
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

export default Gallery;
