import "@fontsource/ubuntu";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactPlayer from "react-player/youtube";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCalendar,
} from "react-icons/fi";

// Placeholder content — replace with real doctor-led talks as they are recorded.
const HEALTH_TALKS = [
  {
    id: "ht-001",
    url: "https://www.youtube.com/watch?v=OoEcHuLVqMo",
    title: "Dengue This Monsoon: Symptoms You Must Not Ignore",
    summary:
      "Early warning signs, when to test, and the home-care steps that prevent complications.",
    category: "Seasonal Threats",
    duration: "8:42",
    publishedAt: "2026-05-12",
    doctor: {
      name: "Dr. Ahmed Hassan",
      specialty: "Internal Medicine",
      initials: "AH",
    },
  },
  {
    id: "ht-002",
    url: "https://www.youtube.com/watch?v=0sAkXLU-W0k",
    title: "Hypertension After 40: What Every Adult Should Know",
    summary:
      "The silent risk factors, how often to screen, and lifestyle changes that actually move the numbers.",
    category: "Disease Awareness",
    duration: "11:05",
    publishedAt: "2026-04-28",
    doctor: {
      name: "Dr. Farzana Rahman",
      specialty: "Cardiology",
      initials: "FR",
    },
  },
  {
    id: "ht-003",
    url: "https://www.youtube.com/watch?v=oChQH0QcUZQ",
    title: "Diabetes & Your Eyes: Preventing Retinopathy",
    summary:
      "Why annual retinal screening matters and the red flags that need urgent ophthalmic review.",
    category: "Prevention",
    duration: "9:18",
    publishedAt: "2026-04-10",
    doctor: {
      name: "Dr. Sabbir Ahmed",
      specialty: "Ophthalmology",
      initials: "SA",
    },
  },
  {
    id: "ht-004",
    url: "https://www.youtube.com/watch?v=kDEaE-Cra7s",
    title: "Antibiotic Resistance: Use Them Right or Lose Them",
    summary:
      "Why finishing your course matters and how misuse is creating untreatable infections in Bangladesh.",
    category: "Disease Awareness",
    duration: "7:33",
    publishedAt: "2026-03-22",
    doctor: {
      name: "Dr. Nusrat Jahan",
      specialty: "Infectious Disease",
      initials: "NJ",
    },
  },
  {
    id: "ht-005",
    url: "https://www.youtube.com/watch?v=OoEcHuLVqMo",
    title: "Mental Health at Work: Recognising Burnout Early",
    summary:
      "Practical screening questions, when to seek help, and what evidence-based treatment looks like.",
    category: "Mental Health",
    duration: "12:50",
    publishedAt: "2026-03-05",
    doctor: {
      name: "Dr. Tasnim Akter",
      specialty: "Psychiatry",
      initials: "TA",
    },
  },
  {
    id: "ht-006",
    url: "https://www.youtube.com/watch?v=0sAkXLU-W0k",
    title: "Ask a Doctor: Your Top 10 Questions on Cholesterol",
    summary:
      "Statins, diet myths, and the tests that actually predict cardiovascular risk — answered.",
    category: "Ask a Doctor",
    duration: "14:21",
    publishedAt: "2026-02-18",
    doctor: {
      name: "Dr. Farzana Rahman",
      specialty: "Cardiology",
      initials: "FR",
    },
  },
];

const CATEGORIES = [
  "All",
  "Disease Awareness",
  "Prevention",
  "Seasonal Threats",
  "Mental Health",
  "Ask a Doctor",
];

const CATEGORY_TONE = {
  "Disease Awareness": "bg-rose-500/90",
  Prevention: "bg-emerald-500/90",
  "Seasonal Threats": "bg-amber-500/90",
  "Mental Health": "bg-indigo-500/90",
  "Ask a Doctor": "bg-PDCL-green/90",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const HealthTalks = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionsRef = useRef([]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? HEALTH_TALKS
        : HEALTH_TALKS.filter((t) => t.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.style.transform = "translateZ(0)";
          }
        });
      },
      {
        threshold: prefersReducedMotion ? 0.3 : 0.1,
        rootMargin: "30px",
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const openLightbox = (talkId) => {
    const idx = filtered.findIndex((t) => t.id === talkId);
    if (idx === -1) return;
    setCurrentIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigate = useCallback(
    (direction) => {
      setCurrentIndex((prev) => {
        const len = filtered.length;
        if (len === 0) return prev;
        return direction === "prev"
          ? (prev - 1 + len) % len
          : (prev + 1) % len;
      });
    },
    [filtered.length]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, navigate]);

  const activeTalk = filtered[currentIndex];

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-white min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-16 pb-10 px-4 sm:pt-20 sm:pb-14 md:pt-28 md:pb-20 lg:px-8 max-w-7xl mx-auto"
        style={{ paddingTop: "max(4rem, env(safe-area-inset-top))" }}>
        <div
          className="scroll-fade max-w-4xl"
          ref={(el) => (sectionsRef.current[0] = el)}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-PDCL-green/10 text-PDCL-green border border-PDCL-green/20 mb-5 font-ubuntu text-xs sm:text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-PDCL-green-light animate-pulse" />
            New videos every week
          </div>
          <h1 className="text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 sm:mb-6 font-ubuntu tracking-tight">
            Health{" "}
            <span className="bg-gradient-to-r from-PDCL-green-light to-PDCL-green bg-clip-text text-transparent">
              Talks
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light leading-relaxed font-ubuntu max-w-3xl">
            Short, trustworthy explainers from PDCL doctors on the diseases,
            seasonal threats, and prevention habits that matter most for
            Bangladesh today.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div
          className="scroll-fade"
          ref={(el) => (sectionsRef.current[1] = el)}>
          <div className="flex flex-wrap gap-2 sm:gap-3 pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileTap={{ scale: 0.96 }}
                  className={
                    "px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium font-ubuntu transition-all duration-200 touch-manipulation min-h-[40px] " +
                    (isActive
                      ? "bg-PDCL-green text-white shadow-depth-2"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-PDCL-green/40 hover:text-PDCL-green")
                  }
                  aria-pressed={isActive}>
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-10 px-4 sm:py-14 sm:px-6 md:py-16 lg:py-20 lg:px-8 max-w-7xl mx-auto">
        <div
          className="scroll-fade"
          ref={(el) => (sectionsRef.current[2] = el)}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 text-gray-500 font-ubuntu">
                No talks in this category yet — check back soon.
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filtered.map((talk, index) => (
                  <motion.article
                    layout
                    key={talk.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="glass-medical rounded-2xl shadow-depth-2 overflow-hidden group hover-lift cursor-pointer flex flex-col"
                    onClick={() => openLightbox(talk.id)}>
                    {/* Thumbnail */}
                    <div className="relative w-full pt-[56.25%] bg-gray-100 overflow-hidden">
                      <ReactPlayer
                        url={talk.url}
                        width="100%"
                        height="100%"
                        className="absolute top-0 left-0"
                        light={true}
                        playIcon={
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-PDCL-green-light/95 group-hover:bg-PDCL-green rounded-full p-4 sm:p-5 text-white transform group-hover:scale-110 transition-all duration-300 shadow-depth-3 min-h-[56px] min-w-[56px] flex items-center justify-center">
                              <FiPlay className="w-6 h-6 sm:w-7 sm:h-7 ml-1" />
                            </div>
                          </div>
                        }
                        style={{ WebkitBackfaceVisibility: "hidden" }}
                      />
                      <span
                        className={
                          "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-white font-ubuntu backdrop-blur-sm " +
                          (CATEGORY_TONE[talk.category] || "bg-gray-700/90")
                        }>
                        {talk.category}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-[11px] sm:text-xs font-medium text-white bg-black/70 backdrop-blur-sm flex items-center gap-1 font-ubuntu">
                        <FiClock className="w-3 h-3" />
                        {talk.duration}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <h3 className="text-gray-900 font-bold font-ubuntu text-lg sm:text-xl leading-snug mb-2 group-hover:text-PDCL-green transition-colors duration-300">
                        {talk.title}
                      </h3>
                      <p className="text-gray-600 font-ubuntu text-sm leading-relaxed mb-5 flex-1">
                        {talk.summary}
                      </p>

                      {/* Doctor attribution */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-PDCL-green to-PDCL-green-light text-white flex items-center justify-center font-semibold font-ubuntu text-sm shadow-depth-1">
                          {talk.doctor.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 font-ubuntu truncate">
                            {talk.doctor.name}
                          </div>
                          <div className="text-xs text-gray-500 font-ubuntu truncate">
                            {talk.doctor.specialty}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-ubuntu whitespace-nowrap">
                          <FiCalendar className="w-3 h-3" />
                          {formatDate(talk.publishedAt)}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && activeTalk && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
            style={{
              paddingTop: "max(0.5rem, env(safe-area-inset-top))",
              paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
              paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
              paddingRight: "max(0.5rem, env(safe-area-inset-right))",
            }}>
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close video">
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={() => navigate("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Previous video">
                  <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => navigate("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-4 z-20 glass-medical text-white p-2 sm:p-3 rounded-full hover:bg-PDCL-green-light/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Next video">
                  <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            <div className="relative w-full max-w-5xl mx-auto">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <ReactPlayer
                  url={activeTalk.url}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  className="rounded-lg sm:rounded-xl overflow-hidden"
                  style={{
                    borderRadius: "0.5rem",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  config={{
                    youtube: {
                      playerVars: { modestbranding: 1, rel: 0 },
                    },
                  }}
                />
              </div>

              <div className="absolute -bottom-20 sm:-bottom-24 left-0 right-0 text-center text-white px-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span
                    className={
                      "px-2.5 py-1 rounded-full text-xs font-semibold font-ubuntu " +
                      (CATEGORY_TONE[activeTalk.category] || "bg-gray-700/90")
                    }>
                    {activeTalk.category}
                  </span>
                  <span className="text-xs text-gray-400 font-ubuntu">
                    {activeTalk.doctor.name} · {activeTalk.doctor.specialty}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold font-ubuntu mb-1">
                  {activeTalk.title}
                </h3>
                {filtered.length > 1 && (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-ubuntu">
                    <span>
                      {currentIndex + 1} of {filtered.length}
                    </span>
                    <span>•</span>
                    <span>Use arrow keys to navigate</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

export default HealthTalks;
