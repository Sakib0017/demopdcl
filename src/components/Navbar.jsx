import image from "../assets/logo1.webp";
import { useState, useRef, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  ArrowDownTrayIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useHoverDepth } from "../hooks/useHoverDepth";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { useBranchCounts } from "../hooks/useBranchCounts";
import { 
  getGlassStyle 
} from "../utils/3d-effects";
import clsx from "clsx";

// Enhanced NavLink with 3D effects and responsive design
const NavLink = ({ to, children, onClick, icon: Icon, description }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const hoverDepth = useHoverDepth({ maxRotation: 5, maxScale: 1.02 });

  return (
    <motion.div
      className="group"
      {...hoverDepth.motionProps}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        onClick={onClick}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation",
          "group-hover:glass group-hover:shadow-depth-2 group-hover:-translate-y-0.5",
          "min-h-[48px] active:bg-PDCL-green/5", // Better touch target and active state
          isActive
            ? "bg-emerald-400/20 md:bg-PDCL-green/10 text-emerald-300 md:text-PDCL-green border border-emerald-400/30 md:border-PDCL-green/20"
            : "text-white/90 md:text-gray-700 hover:text-emerald-300 md:hover:text-PDCL-green hover:bg-white/10 md:hover:bg-transparent"
        )}
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="font-medium font-ubuntu text-base">{children}</div>
          {description && (
            <div className="text-sm text-white/70 md:text-gray-500 group-hover:text-white/80 md:group-hover:text-gray-600 transition-colors">
              {description}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

// Mega Menu Component
const MegaMenu = ({ isOpen, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 w-80 sm:w-96 md:w-[520px] lg:w-[600px] z-[60] mt-2 mega-menu-dropdown"
          style={{
            ...getGlassStyle('light', 0.95)
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}>
          <div className="glass shadow-depth-4 rounded-2xl border border-white/20 backdrop-blur-xl">
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6 font-ubuntu">
                {title}
              </h3>
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);
  const navbarRef = useRef(null);
  const location = useLocation();
  const { hasScrolled } = useScrollPosition();
  const { trackAction } = useSmartNavigation();
  // Was branch.length off the static constants list, which drifts from the
  // backend the moment a branch opens.
  const { totalBranches: branchCount } = useBranchCounts();
  // Smooth hover delay management
  const handleMouseEnter = (menu) => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setActiveMenu(null);
    }, 200); // Slightly longer delay for better UX
    setHoverTimer(timer);
  };

  // Handle navigation container mouse leave
  const handleNavMouseLeave = () => {
    const timer = setTimeout(() => {
      setActiveMenu(null);
    }, 300); // Longer delay when leaving entire nav area
    setHoverTimer(timer);
  };

  // Menu configuration with intelligent grouping
  const menuConfig = {
    care: {
      title: "Find Care",
      items: [
        {
          to: "/our-doctors",
          title: "Find a Doctor",
          description: "Expert specialists across all fields",
          icon: UserIcon,
          featured: true,
        },
        {
          to: "/health",
          title: "Health Packages",
          description: "Comprehensive health checkups",
          icon: HeartIcon,
          featured: true,
        },
        {
          to: "/our-branches",
          title: "Our Branches",
          description: `${branchCount}+ locations across Bangladesh`,
          icon: BuildingOfficeIcon,
          featured: true,
        },
        {
          href: "https://docs.google.com/forms/d/e/1FAIpQLSfnFAHgePOjueWSh2mAoPOuyCjw93Iwdp7jwK7vHvzvVIWxJw/viewform",
          title: "Home Collection",
          description: "Sample collection at your doorstep",
          external: true,
        },
        {
          to: "/hotlines",
          title: "Emergency Hotlines",
          description: "24/7 emergency support",
          icon: PhoneIcon,
        },
        // {
        //   to: "/health-talks",
        //   title: "Health Talks",
        //   description: "Doctor-led health & disease awareness",
        //   icon: PlayCircleIcon,
        // },
      ],
    },
    about: {
      title: "About PDCL",
      items: [
        {
          to: "/goals",
          title: "Our Mission",
          description: "Objectives & Goals",
        },
        {
          to: "/chairman",
          title: "Chairman's Message",
          description: "Leadership vision",
        },
        {
          to: "/md",
          title: "Managing Director",
          description: "Executive message",
        },
        {
          to: "/dmd",
          title: "Deputy Managing Director",
          description: "Leadership insights",
        },
        {
          to: "/director",
          title: "Director",
          description: "Leadership insights",
        },
        
        {
          to: "/about",
          title: "Management Team",
          description: "Our leadership",
        },
        {
          to: "/tech",
          title: "Our Technologies",
          description: "Advanced medical equipment",
        },
        {
          to: "/gallery",
          title: "Photo Gallery",
          description: "Facilities & events",
        },
        {
          to: "/video",
          title: "Corporate Videos",
          description: "Learn more about us",
        },
        {
          to: "/notice",
          title: "Notices",
          description: "Latest announcements",
        },
      ],
    },
  };

  return (
    <>
      {/* Main Navbar */}
      <header
        ref={navbarRef}
        className={clsx(
          "sticky top-0 z-40 transition-all duration-300",
          hasScrolled
            ? "glass shadow-depth-3 backdrop-blur-xl"
            : "bg-white shadow-depth-2",
        )}
        style={{
          ...(hasScrolled ? getGlassStyle("light", 0.9) : {}),
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo with 3D hover effect */}
            <motion.div
              className="perspective-1000"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}>
              <Link to="/" className="flex items-center">
                <img
                  src={image}
                  alt="Popular Diagnostic Centre"
                  className="w-12 h-12 lg:w-14 lg:h-14 object-contain hover-lift"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation - Now shows from 768px+ for 720p desktop users */}
            <nav
              className="hidden md:flex items-center space-x-2 relative"
              role="navigation"
              aria-label="Main navigation"
              onMouseLeave={handleNavMouseLeave}>
              {/* Find Care Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("care")}
                onMouseLeave={(e) => {
                  // Don't close if moving to dropdown
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropdown = e.currentTarget.querySelector(
                    ".mega-menu-dropdown",
                  );
                  if (dropdown) {
                    const dropdownRect = dropdown.getBoundingClientRect();
                    if (
                      e.clientY >= rect.bottom &&
                      e.clientY <= dropdownRect.bottom
                    ) {
                      return; // Don't close, moving to dropdown
                    }
                  }
                  handleMouseLeave();
                }}>
                <motion.button
                  className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 text-gray-700 hover:text-PDCL-green font-medium rounded-lg hover:bg-PDCL-green/5 transition-all duration-200 font-ubuntu"
                  whileHover={{ scale: 1.02 }}>
                  <HeartIcon className="w-4 h-4" />
                  Find Care
                  <ChevronDownIcon className="w-4 h-4" />
                </motion.button>

                <MegaMenu
                  isOpen={activeMenu === "care"}
                  onClose={() => setActiveMenu(null)}
                  title={menuConfig.care.title}>
                  <div className="grid grid-cols-1 gap-4">
                    {menuConfig.care.items.map((item, _index) => (
                      <div key={item.to || item.href}>
                        <NavLink
                          to={item.to}
                          icon={item.icon}
                          description={item.description}
                          onClick={() => {
                            setActiveMenu(null);
                            trackAction(item.to, "care");
                          }}>
                          {item.title}
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </MegaMenu>
              </div>

              {/* About Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("about")}
                onMouseLeave={(e) => {
                  // Don't close if moving to dropdown
                  const rect = e.currentTarget.getBoundingClientRect();
                  const dropdown = e.currentTarget.querySelector(
                    ".mega-menu-dropdown",
                  );
                  if (dropdown) {
                    const dropdownRect = dropdown.getBoundingClientRect();
                    if (
                      e.clientY >= rect.bottom &&
                      e.clientY <= dropdownRect.bottom
                    ) {
                      return; // Don't close, moving to dropdown
                    }
                  }
                  handleMouseLeave();
                }}>
                <motion.button
                  className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 text-gray-700 hover:text-PDCL-green font-medium rounded-lg hover:bg-PDCL-green/5 transition-all duration-200 font-ubuntu"
                  whileHover={{ scale: 1.02 }}>
                  About
                  <ChevronDownIcon className="w-4 h-4" />
                </motion.button>

                <MegaMenu
                  isOpen={activeMenu === "about"}
                  onClose={() => setActiveMenu(null)}
                  title={menuConfig.about.title}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuConfig.about.items.map((item, _index) => (
                      <div key={item.to}>
                        <NavLink
                          to={item.to}
                          description={item.description}
                          onClick={() => {
                            setActiveMenu(null);
                            trackAction(item.to, "about");
                          }}>
                          {item.title}
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </MegaMenu>
              </div>

              {/* Report Download Link with Animated Border */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <div className="relative p-0.5 rounded-lg overflow-hidden group">
                  {/* Animated Border Background - Enhanced when active */}
                  <div
                    className={clsx(
                      "absolute inset-0 rounded-lg border-animation",
                      location.pathname === "/patient_portal" &&
                        "opacity-100 scale-105",
                    )}
                    style={{
                      background:
                        location.pathname === "/patient_portal"
                          ? "conic-gradient(from 0deg, #006642 0deg, #00984a 120deg, #006642 240deg, #00984a 360deg)"
                          : "conic-gradient(from 0deg, transparent 270deg, #006642 300deg, #00984a 330deg, transparent 360deg)",
                      animation:
                        location.pathname === "/patient_portal"
                          ? "borderSpin 2s linear infinite"
                          : "borderSpin 3s linear infinite",
                    }}
                  />
                  {/* Active State Glow */}
                  {location.pathname === "/patient_portal" && (
                    <div className="absolute inset-0 rounded-lg bg-PDCL-green/20 shadow-lg shadow-PDCL-green/30" />
                  )}
                  {/* Button Content */}
                  <Link
                    to="/patient_portal"
                    onClick={() => trackAction("/patient_portal", "primary")}
                    className={clsx(
                      "relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 font-medium rounded-lg hover:bg-white/80 hover:backdrop-blur-md transition-all duration-300 font-ubuntu bg-white",
                      location.pathname === "/patient_portal"
                        ? "text-PDCL-green shadow-inner"
                        : "text-gray-700 hover:text-PDCL-green",
                    )}
                    aria-label="Download medical reports">
                    <ArrowDownTrayIcon
                      className={clsx(
                        "w-4 h-4 stroke-2 transition-all",
                        location.pathname === "/patient_portal"
                          ? "text-PDCL-green animate-pulse"
                          : "text-PDCL-green",
                      )}
                    />
                    <span
                      className={
                        location.pathname === "/patient_portal"
                          ? "font-semibold"
                          : ""
                      }>
                      Report Download
                    </span>
                  </Link>
                </div>
              </motion.div>

              {/* Contact Link */}
              <NavLink
                to="/contact-us"
                onClick={() => trackAction("/contact-us", "primary")}>
                Contact
              </NavLink>
            </nav>

            {/* Right Section: Support Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Support Button - Desktop Only */}
              <motion.a
                href="https://complain.populardiagnostic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-PDCL-green/5 text-PDCL-green hover:text-PDCL-green-dark hover:bg-PDCL-green/10 transition-all duration-200 hover-lift"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                  <path d="M215.4 96H144 107.8 96v8.8V144v40.4 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3V96c0-26.5 21.5-48 48-48h76.6l49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48H416c26.5 0 48 21.5 48 48v44.3l22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4v-89V144 104.8 96H404.2 368 296.6 215.4zM0 448V242.1L217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1V448v0c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v0zM176 160H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
                <span className="text-sm font-medium font-ubuntu">
                  Complain & Advise
                </span>
              </motion.a>

              {/* Mobile Report Download Icon Button */}
              <motion.div
                className="md:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <div className="relative p-0.5 rounded-xl overflow-hidden">
                  {/* Animated Border Background - Enhanced when active */}
                  <div
                    className={clsx(
                      "absolute inset-0 rounded-xl border-animation",
                      location.pathname === "/patient_portal" &&
                        "opacity-100 scale-105",
                    )}
                    style={{
                      background:
                        location.pathname === "/patient_portal"
                          ? "conic-gradient(from 0deg, #006642 0deg, #00984a 120deg, #006642 240deg, #00984a 360deg)"
                          : "conic-gradient(from 0deg, transparent 270deg, #006642 300deg, #00984a 330deg, transparent 360deg)",
                      animation:
                        location.pathname === "/patient_portal"
                          ? "borderSpin 2s linear infinite"
                          : "borderSpin 3s linear infinite",
                    }}
                  />
                  {/* Active State Inner Glow */}
                  {location.pathname === "/patient_portal" && (
                    <div className="absolute inset-1 rounded-lg bg-PDCL-green/10 shadow-inner" />
                  )}
                  {/* Icon Button Content */}
                  <Link
                    to="/patient_portal"
                    onClick={() => trackAction("/patient_portal", "mobile")}
                    className={clsx(
                      "relative flex items-center justify-center p-3 font-medium rounded-xl hover:bg-white/80 active:bg-white/80 hover:backdrop-blur-md transition-all duration-300 bg-white touch-manipulation",
                      location.pathname === "/patient_portal"
                        ? "text-PDCL-green shadow-inner"
                        : "text-gray-700 hover:text-white",
                    )}
                    style={{ minWidth: "44px", minHeight: "44px" }}
                    aria-label="Download medical reports">
                    <ArrowDownTrayIcon
                      className={clsx(
                        "w-5 h-5 stroke-2 font-bold transition-all",
                        location.pathname === "/patient_portal"
                          ? "text-PDCL-green animate-bounce"
                          : "text-PDCL-green",
                      )}
                    />
                  </Link>
                </div>
              </motion.div>

              {/* Mobile Menu Button - Enhanced for Touch */}
              <motion.button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-3 rounded-xl bg-PDCL-green/5 text-PDCL-green hover:text-PDCL-green-dark hover:bg-PDCL-green/10 transition-colors duration-200 touch-manipulation"
                style={{ minWidth: "44px", minHeight: "44px" }} // WCAG touch target minimum
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95, rotate: -5 }}
                animate={mobileOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.3,
                }}
                aria-label="Open mobile menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu">
                <motion.div
                  animate={
                    mobileOpen
                      ? { opacity: 0, scale: 0.8 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.2 }}>
                  <Bars3Icon className="h-6 w-6 mx-auto" />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Modal */}
      <Transition appear show={mobileOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[100] md:hidden"
          onClose={setMobileOpen}
          id="mobile-menu"
          aria-labelledby="mobile-menu-title">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-end p-2 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="translate-x-full opacity-0 scale-95"
                enterTo="translate-x-0 opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="translate-x-0 opacity-100 scale-100"
                leaveTo="translate-x-full opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden glass rounded-2xl shadow-depth-5 transition-all max-h-screen">
                  {/* Mobile Menu Header */}
                  <motion.div
                    className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}>
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.4,
                        ease: "easeOut",
                      }}>
                      <motion.img
                        src={image}
                        alt="PDCL"
                        className="w-10 h-10 object-contain rounded-lg border-2 border-white/80 bg-white p-1 shadow-sm"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.3,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                      />
                      <motion.h2
                        id="mobile-menu-title"
                        className="text-lg font-semibold text-white font-ubuntu"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}>
                        Menu
                      </motion.h2>
                    </motion.div>
                    <motion.button
                      className="p-3 rounded-xl bg-PDCL-green/10 text-white/80 hover:text-white hover:bg-PDCL-green/20 transition-colors touch-manipulation"
                      style={{ minWidth: "44px", minHeight: "44px" }}
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, scale: 0, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 150,
                      }}
                      whileHover={{ scale: 1.05, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close mobile menu">
                      <XMarkIcon className="h-5 w-5 mx-auto" />
                    </motion.button>
                  </motion.div>

                  {/* Mobile Menu Content */}
                  <div
                    className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain"
                    style={{ scrollbarWidth: "thin" }}>
                    {/* Primary Actions */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.4,
                        ease: "easeOut",
                      }}>
                      <motion.h3
                        className="text-lg font-semibold text-white font-ubuntu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}>
                        Quick Actions
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.3 }}>
                        <NavLink
                          to="/patient_portal"
                          onClick={() => setMobileOpen(false)}
                          icon={UserIcon}
                          description="Download reports from your visited branch">
                          Report Download
                        </NavLink>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.3 }}>
                        <NavLink
                          to="/our-doctors"
                          onClick={() => setMobileOpen(false)}
                          icon={UserIcon}
                          description="Find expert specialists">
                          Find a Doctor
                        </NavLink>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.3 }}>
                        <NavLink
                          to="/health"
                          onClick={() => setMobileOpen(false)}
                          icon={HeartIcon}
                          description="Comprehensive health checkups">
                          Health Packages
                        </NavLink>
                      </motion.div>
                    </motion.div>

                    {/* Services Section */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1.0,
                        duration: 0.4,
                        ease: "easeOut",
                      }}>
                      <motion.h3
                        className="text-lg font-semibold text-white font-ubuntu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1, duration: 0.3 }}>
                        Find Care
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.3 }}>
                        <NavLink
                          to="/our-branches"
                          onClick={() => setMobileOpen(false)}
                          icon={BuildingOfficeIcon}
                          description={`${branchCount}+ locations`}>
                          Our Branches
                        </NavLink>
                      </motion.div>

                      <motion.a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfnFAHgePOjueWSh2mAoPOuyCjw93Iwdp7jwK7vHvzvVIWxJw/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:shadow-depth-2 transition-all duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}>
                        <motion.svg
                          className="w-5 h-5 text-emerald-300"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{
                            delay: 1.4,
                            duration: 0.4,
                            type: "spring",
                          }}>
                          <path d="M0 64C0 46.3 14.3 32 32 32H88h48 56c17.7 0 32 14.3 32 32s-14.3 32-32 32V400c0 44.2-35.8 80-80 80s-80-35.8-80-80V96C14.3 96 0 81.7 0 64zM136 96H88V256h48V96zM288 64c0-17.7 14.3-32 32-32h56 48 56c17.7 0 32 14.3 32 32s-14.3 32-32 32V400c0 44.2-35.8 80-80 80s-80-35.8-80-80V96c-17.7 0-32-14.3-32-32zM424 96H376V256h48V96z" />
                        </motion.svg>
                        <div>
                          <div className="font-medium text-white font-ubuntu">
                            Home Collection
                          </div>
                          <div className="text-sm text-white/70">
                            Sample collection at your doorstep
                          </div>
                        </div>
                      </motion.a>

                      {/* <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.3 }}>
                        <NavLink
                          to="/health-talks"
                          onClick={() => setMobileOpen(false)}
                          icon={PlayCircleIcon}
                          description="Doctor-led health & disease awareness">
                          Health Talks
                        </NavLink>
                      </motion.div> */}
                    </motion.div>

                    {/* About Section - Accordion Style */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white font-ubuntu">
                        About PDCL
                      </h3>

                      <div className="space-y-2">
                        {[
                          { to: "/goals", title: "Our Mission" },
                          { to: "/chairman", title: "Chairman's Message" },
                          { to: "/director", title: "Managing Director" },
                          { to: "/dmd", title: "Deputy Managing Director" },
                          { to: "/about", title: "Management Team" },
                          { to: "/tech", title: "Our Technologies" },
                          { to: "/gallery", title: "Photo Gallery" },
                          { to: "/video", title: "Corporate Videos" },
                          { to: "/notice", title: "Notices" },
                        ].map((item, _index) => (
                          <div key={item.to}>
                            <Link
                              to={item.to}
                              onClick={() => setMobileOpen(false)}
                              className="block px-4 py-2 text-white/90 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-all duration-200 font-ubuntu">
                              {item.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact & Support */}
                    <div className="space-y-3 border-t border-white/20 pt-6">
                      <div>
                        <NavLink
                          to="/contact-us"
                          onClick={() => setMobileOpen(false)}
                          description="Get in touch with us">
                          Contact Us
                        </NavLink>
                      </div>

                      <div>
                        <NavLink
                          to="/complain"
                          onClick={() => setMobileOpen(false)}
                          description="Feedback & suggestions">
                          Complain and Advise
                        </NavLink>
                      </div>
                    </div>

                    {/* Emergency Contact - Enhanced */}
                    <a
                      href="tel:10636"
                      className="block glass-medical rounded-xl p-4 border border-PDCL-green/20 hover:border-PDCL-green/40 transition-all duration-200 touch-manipulation"
                      style={{ minHeight: "64px" }}>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center">
                          <PhoneIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-emerald-300 font-ubuntu text-base">
                            Emergency Hotline
                          </div>
                          <div className="text-sm text-white/80">
                            10636 - Available 24/7
                          </div>
                        </div>
                        <div className="text-xs text-emerald-300 font-medium">
                          TAP TO CALL
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Navbar;
