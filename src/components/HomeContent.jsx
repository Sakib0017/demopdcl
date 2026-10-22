import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { logo } from "../assets";
import {
  healthPakage,
  whyChooseUs,
  diagnosticServices,
  medicalSpecialities,
} from "../constants/homepage";
import { useBranchCounts } from "../hooks/useBranchCounts";
import specialityConsultation from "../assets/specialityConsultation.webp";
import videoWebM from "../assets/contactsResized.webm";
import videoMP4 from "../assets/contactsResized.mp4";
import { styles } from "../styles";
import "@fontsource/ubuntu";
import { Link } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

// Simplified video component with WebM/MP4 fallback
const VideoElement = ({ videoSources, className, autoPlay = true, loop = true, muted = true, playsInline = true, preload = "metadata", onCanPlay, ariaLabel, ...props }) => {
  // Handle both old (string) and new (object) video format
  const getVideoSources = () => {
    if (typeof videoSources === 'string') {
      return [{ src: videoSources, type: 'video/mp4' }];
    }
    if (videoSources && typeof videoSources === 'object') {
      const sources = [];
      if (videoSources.webm) sources.push({ src: videoSources.webm, type: 'video/webm' });
      if (videoSources.mp4) sources.push({ src: videoSources.mp4, type: 'video/mp4' });
      return sources;
    }
    return [];
  };

  const sources = getVideoSources();

  return (
    <video
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      onCanPlay={onCanPlay}
      aria-label={ariaLabel}
      {...props}
    >
      {sources.map((source, index) => (
        <source key={index} src={source.src} type={source.type} />
      ))}
      Your browser does not support the video tag.
    </video>
  );
};



// 3000 -> "3,000". Locale is pinned so the separator can't vary by visitor.
const formatStatValue = (n) => Math.round(n).toLocaleString("en-US");

// The count-up is decorative, so honour the OS setting and show the final value
// immediately. index.css already covers the CSS keyframe animations, but this
// one is driven by react-spring in JS and that media query can't reach it.
const prefersReducedMotion =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Counter = ({ n, suffix = "" }) => {
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });

    if (countRef.current) observer.observe(countRef.current);

    return () => observer.disconnect();
  }, []);

  const { number } = useSpring({
    from: { number: 0 },
    number: isVisible ? n : 0,
    delay: 500,
    // A fixed duration, not a spring. The previous {tension: 10, friction: 10}
    // was too slack to converge: it read "2,878" for 3000 and "40" for 42, and
    // each card settled at a different time because a spring's duration depends
    // on its target. A tween always lands exactly on the target, together.
    config: { duration: 2000 },
    immediate: prefersReducedMotion,
  });

  return (
    // <span>, not <div>: this renders inside a <p> in StatCard, and a
    // block-level child would make the browser auto-close that <p>.
    <span ref={countRef} className="inline-flex items-baseline justify-start">
      <animated.span>{number.to(formatStatValue)}</animated.span>
      {/* whitespace-pre preserves the leading space in word suffixes like
          " Million+" — as separate flex items they would otherwise render as
          "10Million+". Sized a step down so those words still fit the card at
          375px, and baseline-aligned so it reads as one figure. */}
      {suffix && (
        <span className="whitespace-pre text-sm font-semibold text-PDCL-green-light sm:text-base lg:text-lg">
          {suffix}
        </span>
      )}
    </span>
  );
};

const StatCard = ({ icon, value, label, suffix = "" }) => {
  const ariaLabel = `${formatStatValue(value)}${suffix} ${label}`;
  
  return (
    // Depth is one system, not four overlays. The surface is lit from above —
    // white at the top fading to a green pool at the base — and the card sits on
    // shadow-depth-2. On hover it rises: depth-2 -> depth-4, lifts 4px, scales
    // 1.03, and the green pool deepens. hover:z-10 keeps the scaled card above
    // its neighbours instead of being clipped by the next one in DOM order.
    // (This replaced a stack of shimmer + gradient-border + glow overlays that
    // each animated separately; the elevation read is stronger from one.)
    //
    // Stacked until lg, horizontal above it. The old card was always a row, so
    // at 375px the icon ate ~40% of a 163px card and left the figure ~80px —
    // which is why "10 Million+" overflowed. Stacked, the text owns the card's
    // full width, so the numeral could get *larger* and still fit. The switch
    // waits for lg because a 640-1023px card is still too narrow to give the
    // icon a column and leave room for "3,000+" beside it.
    <div
      className="group relative flex h-full flex-col justify-center gap-3 rounded-xl border border-PDCL-green/10 bg-gradient-to-b from-white via-white/95 to-PDCL-green/10 p-4 shadow-depth-2 backdrop-blur-sm transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:scale-[1.03] hover:border-PDCL-green/30 hover:to-PDCL-green/25 hover:shadow-depth-4 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00984a] focus-within:ring-offset-2 min-h-[124px] sm:p-5 lg:flex-row lg:items-center lg:justify-center lg:gap-5 lg:p-6"
      role="region"
      aria-label={ariaLabel}
      tabIndex="0">
      <div className="w-fit flex-shrink-0 rounded-xl bg-PDCL-green/10 p-2.5 transition-colors duration-300 group-hover:bg-PDCL-green/20 sm:p-3">
        <svg
          className="h-6 w-6 fill-PDCL-green transition-transform duration-300 group-hover:-rotate-6 sm:h-7 sm:w-7 lg:h-9 lg:w-9"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path d={icon} />
        </svg>
      </div>

      {/* flex-initial at lg so the block sizes to its content and the card's
          justify-center can actually centre the icon+text group; flex-1 would
          make it fill the card and leave the group pinned left. */}
      <div className="min-w-0 flex-1 text-left lg:flex-initial">
        {/* Deliberately a <p>, not a heading: a bare figure like "3,000+" is a
            value, not a section title, and five of them polluted the page's
            heading outline. The card's role="region" + aria-label already
            announces the full "3,000+ Medical & Diagnostic Services" string.
            tabular-nums keeps the digits from jittering as the count-up runs. */}
        <p className="font-ubuntu text-2xl font-bold leading-none tracking-tight text-PDCL-green tabular-nums sm:text-3xl lg:text-4xl">
          <Counter n={value} suffix={suffix} />
        </p>
        {/* The underline of a lab-report field: separates measured value from
            field name, and gives five very differently-sized figures one shared
            anchor. */}
        <div className="my-2 h-px w-8 bg-PDCL-green-light/50 transition-all duration-300 group-hover:w-12 group-hover:bg-PDCL-green-light" />
        <p className="font-ubuntu text-xs font-medium leading-snug text-gray-600 transition-colors duration-300 group-hover:text-gray-800 sm:text-sm lg:text-base">
          {label}
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group relative flex h-full flex-col gap-3 rounded-xl border border-PDCL-green/10 bg-gradient-to-b from-white via-white/95 to-PDCL-green/10 p-6 shadow-depth-2 transition-all duration-300 hover:-translate-y-1 hover:border-PDCL-green/30 hover:to-PDCL-green/25 hover:shadow-depth-4 motion-reduce:hover:translate-y-0">
    <div className="w-fit rounded-xl bg-PDCL-green/10 p-3 transition-colors duration-300 group-hover:bg-PDCL-green/20">
      <Icon className="h-7 w-7 text-PDCL-green" aria-hidden="true" />
    </div>
    <h3 className="font-ubuntu text-lg font-bold text-PDCL-green">{title}</h3>
    <p className="font-ubuntu text-sm leading-relaxed text-gray-600">
      {description}
    </p>
  </div>
);

const ServiceCard = ({ icon: Icon, name, department }) => (
  <li className="group relative overflow-hidden rounded-2xl border border-PDCL-green/10 bg-white p-5 shadow-depth-1 transition-all duration-300 hover:-translate-y-1 hover:border-PDCL-green/25 hover:shadow-depth-3 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
    {/* The accent rule wipes in from the left on hover — the one bit of motion
        the card carries, so the lift reads as deliberate rather than generic. */}
    <span
      className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-PDCL-green to-PDCL-green-light transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      aria-hidden="true"
    />
    {/* Icon sits above the label on phones so two cards fit per row — nine
        full-width rows was a screen and a half of scrolling on its own. */}
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-PDCL-green/[0.07] text-PDCL-green ring-1 ring-inset ring-PDCL-green/10 transition-colors duration-300 group-hover:bg-PDCL-green group-hover:text-white motion-reduce:transition-none sm:h-12 sm:w-12">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-ubuntu text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-PDCL-green/60">
          {department}
        </p>
        <p className="mt-1 font-ubuntu text-base font-bold leading-snug text-gray-800">
          {name}
        </p>
      </div>
    </div>
  </li>
);

const SpecialityChip = ({ name, slug }) => (
  <Link
    to={`/our-doctors?specialty=${slug}`}
    aria-label={`See ${name} consultants`}
    className="group inline-flex items-center gap-2 rounded-full border border-PDCL-green/15 bg-PDCL-green/[0.04] px-4 py-2 font-ubuntu text-sm font-medium text-PDCL-green transition-colors duration-200 hover:border-PDCL-green hover:bg-PDCL-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-PDCL-green focus-visible:ring-offset-2 motion-reduce:transition-none">
    {name}
    {/* Kept in flow at all widths — fading it in rather than mounting it on
        hover keeps the chip from resizing and reflowing the whole wrap. */}
    <span
      className="text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
      aria-hidden="true">
      →
    </span>
  </Link>
);

const ProjectCard = ({ name, description, video, source_code_link, link }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const cardRef = useRef(null);
  // Card titles carry the full SEO phrase ("Health Diagnosis – Diagnostic Tests
  // & Laboratory Services") in one <h3> for crawlers, but rendering it as a
  // single same-weight line reads as a wall of text — split on the en dash so
  // the short service name can lead visually and the descriptor trails it.
  const [titleLabel, titleDescriptor] = name.includes(" – ")
    ? name.split(" – ")
    : [name, null];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <article className="h-full flex" ref={cardRef}>
      {/* `group` is what the View More arrow's group-hover:translate-x-1 has
          always been waiting on — without it the arrow never moved. */}
      <div className="group h-full flex flex-col border border-PDCL-green/10 bg-gradient-to-b from-[#F5FFFA]/0 to-[#f0fff0]/60 shadow-depth-1 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-PDCL-green/25 hover:shadow-depth-3 motion-reduce:hover:translate-y-0 w-full focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00984a] focus-within:ring-offset-2">
        <div className="relative w-full aspect-video bg-gray-100">
          {isVisible && (
            <>
              <VideoElement
                videoSources={video}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isVideoLoaded ? 'opacity-90' : 'opacity-0'
                }`}
                onCanPlay={() => setIsVideoLoaded(true)}
                ariaLabel={`${titleLabel} video`}
              />
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5FFFA] to-[#f0fff0]" role="status" aria-label="Loading video">
                  <div className="animate-pulse" aria-hidden="true">
                    <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 512 512">
                      <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z"/>
                    </svg>
                  </div>
                  <span className="sr-only">Loading video content</span>
                </div>
              )}
            </>
          )}
          <div className="absolute inset-0 flex justify-end p-2">
            <button
              onClick={() => window.open(source_code_link, "_blank")}
              className="green-gradient w-11 h-11 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:ring-offset-2 min-w-[44px] min-h-[44px]"
              aria-label="Visit the Popular Diagnostic Centre home page, opens in a new tab">
              <img
                src={logo}
                alt=""
                className="w-1/2 h-1/2 object-contain"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col p-6 flex-grow">
          <h3 className="font-ubuntu leading-snug mb-3">
            <span className="block text-PDCL-green font-bold text-lg sm:text-xl">
              {titleLabel}
            </span>
            {titleDescriptor && (
              // Reserving two lines keeps the three descriptions starting on
              // the same line across the row — "Diagnostic Tests & Laboratory
              // Services" wraps where the other two don't, and every card below
              // it shifted down with it.
              <span className="block text-gray-500 font-medium text-sm sm:text-base mt-0.5 sm:min-h-[3rem] lg:min-h-0">
                {titleDescriptor}
              </span>
            )}
          </h3>
          <p className="text-gray-600 font-ubuntu text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
            {description}
          </p>
          <div className="mt-auto">
            <button
              onClick={() => window.open(link, "_blank")}
              className="inline-flex items-center text-PDCL-green font-ubuntu font-semibold transition-colors duration-200 hover:text-PDCL-green-light focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:ring-offset-2 rounded px-3 py-2 min-h-[44px] min-w-[44px] justify-center sm:justify-start -ml-3">
              View More
              <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const EmergencyBanner = () => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={videoRef}
      className="w-full h-[300px] sm:h-[350px] lg:h-[400px] mt-16 sm:mt-20 pt-16 sm:pt-20 relative"
    >
      {shouldLoadVideo ? (
        <VideoElement
          videoSources={{ webm: videoWebM, mp4: videoMP4 }}
          className="w-full h-full object-cover object-top absolute top-0 left-0"
          ariaLabel="Emergency medical care background video"
        />
      ) : (
        <div className="w-full h-full absolute top-0 left-0 bg-[#00984a]/30" />
      )}
      <div className="absolute w-full h-full top-0 left-0 bg-[#00984a]/70" />
      <div
        className={`${styles.paddingX} absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4`}>
        {/* h2, not h1 — this banner sits mid-page and the page h1 is the
            headline above the stat cards. Styling is unchanged. */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-ubuntu font-bold mb-3 sm:mb-4 leading-tight">
          Do you need Emergency Medical Care? <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>Call @ 10636
        </h2>
        <p className="text-sm sm:text-base lg:text-lg font-medium mb-4 sm:mb-6 leading-relaxed max-w-lg">
          or 09666 787801. You can also reach us by the <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>email: info@populardiagnostic.com
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <a
            href="tel:10636"
            className="bg-white text-[#00984a] border rounded px-4 py-3 sm:px-6 sm:py-3 sm:m-2 hover:bg-[#00984a] hover:text-white transition duration-300 font-medium min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00984a]">
            <FaPhoneAlt className="mr-2" />
            Call Now
          </a>
          <Link
            to="/hotlines"
            className="bg-transparent border border-white text-white rounded px-4 py-3 sm:px-6 sm:py-3 sm:m-2 hover:bg-white hover:text-[#00984a] transition duration-300 font-medium min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00984a]">
            <MdLocalHospital className="mr-2" />
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

const HomeContent = () => {


  // Was hardcoded at 23 branches and 41 units, which fell behind the day a
  // branch opened while /our-branches read the live list and said 24.
  const branchData = useBranchCounts();


  const stats = [
    {
      icon: "M192 48c0-26.5 21.5-48 48-48H400c26.5 0 48 21.5 48 48V512H368V432c0-26.5-21.5-48-48-48s-48 21.5-48 48v80H192V48zM48 96H160V512H48c-26.5 0-48-21.5-48-48V320H80c8.8 0 16-7.2 16-16s-7.2-16-16-16H0V224H80c8.8 0 16-7.2 16-16s-7.2-16-16-16H0V144c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v48H560c-8.8 0-16 7.2-16 16s7.2 16 16 16h80v64H560c-8.8 0-16 7.2-16 16s7.2 16 16 16h80V464c0 26.5-21.5 48-48 48H480V96H592zM312 64c-8.8 0-16 7.2-16 16v24H272c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h24v24c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V152h24c8.8 0 16-7.2 16-16V120c0-8.8-7.2-16-16-16H344V80c0-8.8-7.2-16-16-16H312z",
      value: branchData.totalBranches,
      label: "Branches Nationwide",
    },
    {
      icon: "M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z",
      value: branchData.totalUnits,
      label: "Diagnostic Units",
    },
        {
      icon: "M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96v32V480H384V128 96 56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM96 96h24C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H96V96zM416 480h32c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H416V480zM224 208c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v48h48c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H288v48c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V320H176c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16h48V208z",
      value: 3000,
      label: "Medical & Diagnostic Services",
      suffix: "+",
    },
    {
      icon: "M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z",
      value: 42,
      label: "Years of Excellence",
      suffix: "+",
    },
    {
      icon: "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zm53.5-96.7l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z",
      value: 10,
      label: "Happy Patients Every Year",
      suffix: " Million+",
    },
  ];

  return (
    <main className="relative pt-20 fontFamily-ubuntu" role="main">
      {/* Bottom padding is half the top's: py-32 under the stat cards plus the
          heading block's own margin left ~180px of empty page between the two,
          which read as a missing section rather than breathing room. The top
          padding and the -140px lift still belong to the search overlap. */}
      <section className="overflow-hidden mt-[-140px] pb-10 pt-24 sm:pb-14 sm:pt-32" aria-label="Hospital statistics">
        {/* One grid for every breakpoint. This previously rendered all five
            cards twice — a `block sm:hidden` copy and a `hidden sm:flex` copy —
            which doubled the DOM and meant two sets of aria regions to keep in
            step. Six columns with each card spanning two keeps all five cards
            exactly equal in width (content-sized flex cards were visibly ragged:
            283px next to 345px), and starting the fourth card at column 2
            centres the trailing pair under the first three. */}
        {/* Padding matches Search.jsx so the grid lines up with the search bar
            directly above it — at 1440px the two were previously 1216px and
            1152px wide, close enough to read as a mistake rather than a change. */}
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12 xl:px-16">
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-6 sm:gap-6 lg:gap-8"
            role="region"
            aria-label="Key statistics about Popular Diagnostic Centre">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`sm:col-span-2 ${index === 3 ? "sm:col-start-2" : ""}`}>
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* aria-label was "Health packages", which is no longer true of the whole
          section — it now opens with the page h1 and its description. The cards
          below keep their own labelled region, so this one is dropped rather
          than renamed: an unnamed <section> isn't exposed as a region, which
          avoids announcing the page heading as part of a packages landmark. */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-4 sm:pb-20 sm:pt-6">
        {/* The page h1. The hero/search overlap leaves no room for it above the
            fold — .search-35-percent-coverage pulls Search up over the carousel
            by -18vh to -28vh — so it lives in the first heading slot the design
            already has. Copy from the SEO team, trimmed of the brand-name
            prefix so it still fits two lines at sm.

            Centred, in the same green at nearly the same size as every h2 down
            the page, it read as one more section title. Setting it left on the
            page rail in deep green with the lead beside it gives the page one
            opening statement and leaves green-on-green for the sections. */}
        {false && (
        <div className="grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span
              className="block h-1 w-16 rounded-full bg-gradient-to-r from-PDCL-green to-PDCL-green-light"
              aria-hidden="true"
            />
            <h1 className="mt-6 font-ubuntu text-3xl font-bold leading-[1.15] tracking-tight text-[#08321F] sm:text-4xl lg:text-[2.75rem]">
              Trusted Diagnostic Centre &amp; Healthcare Services in Bangladesh
            </h1>
          </div>
          <p className="font-ubuntu text-sm leading-relaxed text-gray-600 sm:text-base lg:col-span-5 lg:pb-1">
            Book specialist doctor appointments, diagnostic and blood tests,
            pathology, imaging, MRI, CT scans and health checkup packages across{" "}
            {branchData.totalBranches}+ locations from Bangladesh&apos;s trusted
            diagnostic centre.
          </p>
        </div>
        )}

        {/* h2, not the <span> this was: it labels the card grid below, and as a
            span the outline skipped h1 -> h3. It also sat marooned in the gap
            between the lead and the cards; on the grid's own rail with the rule
            running out to the margin, it reads as the group's header. */}
        {/* The rule only earns its place once the label leaves room for it —
            below sm the label alone is the full width of the screen. */}
        <div className="mt-12 flex flex-col gap-3 sm:mt-16 sm:flex-row sm:items-center sm:gap-5">
          <h2 className="font-ubuntu text-xs font-semibold uppercase tracking-[0.15em] text-PDCL-green sm:shrink-0 sm:text-sm sm:tracking-[0.2em]">
            Our Advanced Diagnostic Centre services
          </h2>
          <span
            className="hidden h-px flex-1 bg-PDCL-green/15 sm:block"
            aria-hidden="true"
          />
        </div>

        {/* px-6 on the section, none here: the grid used to carry px-12 of its
            own, so these three cards started 24px to the right of every other
            card on the page. */}
        <div
          className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          role="region"
          aria-label="Available health packages">
          {healthPakage.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </section>

      {false && (
      <>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20" aria-label="Why choose Popular Diagnostic Centre Ltd.">
        {/* Left on the page rail like the sections either side of it — a lone
            centred heading in the middle of the run broke the rhythm. */}
        <div className="mb-10 sm:mb-14">
          <h2 className="font-ubuntu text-2xl font-bold leading-snug text-PDCL-green-light sm:text-3xl">
            Why Choose Popular Diagnostic Centre Ltd.?
          </h2>
          <span
            className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-PDCL-green to-PDCL-green-light"
            aria-hidden="true"
          />
        </div>
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="region"
          aria-label="Reasons to choose Popular Diagnostic Centre Ltd.">
          {whyChooseUs.map((item) => (
            <FeatureCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* Mist band: the three sections around this one are all white, so the
          wash is what separates "what we test" from "who we are". */}
      <section
        className="border-y border-PDCL-green/10 bg-[#F4FAF6] py-16 sm:py-20"
        aria-label="Our medical tests and diagnostic services">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-14">
            {/* The heading rides along the grid instead of sitting centred above
                it — nine cards under one centred block read as a footer strip. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-ubuntu text-xs font-semibold uppercase tracking-[0.2em] text-PDCL-green/70">
                Tests &amp; scans
              </p>
              <h2 className="mt-3 font-ubuntu text-2xl font-bold leading-snug text-PDCL-green-light sm:text-3xl">
                Our Medical Tests &amp; Diagnostic Services
              </h2>
              <span
                className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-PDCL-green to-PDCL-green-light"
                aria-hidden="true"
              />
              <p className="mt-5 font-ubuntu text-sm leading-relaxed text-gray-600">
                Our diagnostic centre offers comprehensive diagnostic services
                and medical tests across laboratory, imaging and radiology, on
                equipment that includes the Alegria 2 immunology analyzer,
                Vitros XT 7600 and Siemens Healthineers. You get accurate
                reports, online booking, physician consultation and world-class
                healthcare across Dhaka and Bangladesh, with quality, trust and
                patient comfort.
              </p>
            </div>
            <ul
              className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3"
              aria-label="Our diagnostic services">
              {diagnosticServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="py-16 sm:py-20"
        aria-label="Medical specialities we cover">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start lg:gap-16">
            <figure className="relative mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:mx-0 lg:max-w-none">
              <div className="overflow-hidden rounded-[2rem] rounded-tl-lg border border-PDCL-green/10 shadow-depth-3">
                <img
                  src={specialityConsultation}
                  alt="A paediatrician listening to a young patient's chest with a stethoscope during a consultation"
                  width="800"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Counted from the list rather than typed, so the number can't
                  drift out of step with the chips beside it. */}
              <figcaption className="relative -mt-10 ml-4 mr-8 rounded-2xl border border-PDCL-green/10 bg-white/95 p-4 shadow-depth-3 backdrop-blur sm:ml-6">
                <span className="font-ubuntu text-3xl font-bold leading-none text-PDCL-green">
                  {medicalSpecialities.length}
                </span>
                <span className="mt-1 block font-ubuntu text-sm leading-snug text-gray-600">
                  specialities, each with its own list of consultants.
                </span>
              </figcaption>
            </figure>

            <div>
              <p className="font-ubuntu text-xs font-semibold uppercase tracking-[0.2em] text-PDCL-green/70">
                Consultation
              </p>
              <h2 className="mt-3 font-ubuntu text-2xl font-bold leading-snug text-PDCL-green-light sm:text-3xl">
                Specialities We Cover
              </h2>
              <span
                className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-PDCL-green to-PDCL-green-light"
                aria-hidden="true"
              />
              <p className="mt-5 max-w-2xl font-ubuntu text-sm leading-relaxed text-gray-600 sm:text-base">
                Pick a speciality to see its consultants, then narrow them down
                by branch and practice day.
              </p>
              <div
                className="mt-8 flex flex-wrap gap-3"
                role="region"
                aria-label="Medical specialities available">
                {medicalSpecialities.map((speciality) => (
                  <SpecialityChip key={speciality.slug} {...speciality} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
      )}

      <section aria-label="Emergency contact information">
        <EmergencyBanner />
      </section>
    </main>
  );
};

export default HomeContent;
