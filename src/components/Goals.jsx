import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Dhanmondi, objective } from "../assets";
import goals1 from "../assets/goals1.jpg";
import mirpur from "../assets/PDCLbranches/MirpurU2.webp";
import goals3 from "../assets/goals3.jpg";
import { useBranchCounts } from "../hooks/useBranchCounts";

const Goals = () => {
  const { totalBranches } = useBranchCounts();
  const timelineRef = useRef(null);
  const sectionsRef = useRef([]);

  // Mobile-first scroll animation observer with iOS optimizations
  useEffect(() => {
    // Reduced motion check for iOS accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // iOS performance optimization - force hardware acceleration
            entry.target.style.transform = 'translateZ(0)';
          }
        });
      },
      { 
        threshold: prefersReducedMotion ? 0.3 : 0.1, 
        rootMargin: '30px' // Reduced for mobile performance
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen overflow-x-hidden">
      {/* Mobile-first hero section with iOS safe areas */}
      <section className="relative pt-16 pb-8 px-4 sm:pt-20 sm:pb-12 md:pt-28 md:pb-16 lg:px-8 max-w-7xl mx-auto">
        <div
          className="text-center max-w-4xl mx-auto scroll-fade"
          ref={(el) => (sectionsRef.current[0] = el)}
          style={{ paddingTop: "env(safe-area-inset-top)" }}>
          {/* Mobile-first typography scaling */}
          <h1 className="text-3xl leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8">
            The New Way to{" "}
            <span className="block sm:inline text-PDCL-green-light bg-gradient-to-r from-PDCL-green-light to-PDCL-green bg-clip-text text-transparent">
              Diagnostic Treatment
            </span>
          </h1>

          {/* Mobile-optimized paragraph */}
          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 font-light px-2 sm:px-0">
            Popular is committed to render the possible standard service to the
            people of the country at an affordable cost. This will definitely
            reduce the burden of the government and will make the path of
            &ldquo;Health for all&rdquo;.
          </p>

          {/* Mobile-first CTA with proper touch targets */}
          <Link
            to="/about"
            className="inline-block group"
            aria-label="Meet our team">
            <button className="bg-PDCL-green-light active:bg-PDCL-green hover:bg-PDCL-green text-white font-semibold py-4 px-8 sm:px-10 rounded-full transition-all duration-300 shadow-medical touch-manipulation min-h-[48px] min-w-[48px] text-base sm:text-lg">
              Meet Our Team
              <svg
                className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 group-active:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </Link>
        </div>
      </section>

      {/* Mobile-first "Who We Are" section */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 max-w-7xl mx-auto">
        <div
          className="glass-medical rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-depth-2 sm:shadow-depth-3 overflow-hidden scroll-fade"
          ref={(el) => (sectionsRef.current[1] = el)}>
          {/* Mobile-first layout - image first on mobile */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0">
            {/* Image section - full width on mobile */}
            <div className="order-1 lg:order-1 p-4 sm:p-6 lg:p-8 xl:p-12">
              <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src={Dhanmondi}
                  className="w-full h-48 sm:h-64 lg:h-auto object-cover transition-all duration-500 touch-manipulation"
                  alt="Dhanmondi Branch - PDCL's flagship location"
                  loading="lazy"
                  decoding="async"
                  style={{ WebkitBackfaceVisibility: "hidden" }} // iOS optimization
                />
                {/* Reduced hover effects for mobile performance */}
                <div className="absolute inset-0 bg-medical-gradient opacity-0 lg:group-hover:opacity-10 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
              </div>
            </div>

            {/* Content section */}
            <div className="order-2 lg:order-2 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center">
              {/* Mobile-first heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 relative">
                <span className="relative z-10">Who We Are</span>
                <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-1 bg-PDCL-green-light rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-10 sm:w-12 h-1 bg-PDCL-green rounded-full animate-pulse"></div>
              </h2>

              {/* Mobile-optimized content */}
              <div className="space-y-4 sm:space-y-6">
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Popular Diagnostic Centre Ltd. is an advanced Centre for
                  diagnostic and medical services. It is one of the prestigious
                  diagnostic complexes of Bangladesh which started its
                  activities in 1983.
                </p>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Popular Diagnostic Centre Ltd. is the largest diagnostic
                  services provider organization in private sector of the
                  country. It has been pioneer in introducing world latest
                  medical equipments and advanced technology to provide round
                  the clock medical investigations and consultancy services.
                </p>
              </div>

              {/* Mobile-first legal status card */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 glass-medical rounded-xl sm:rounded-2xl border-l-4 border-PDCL-green-light">
                <p className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">
                  <span className="font-bold text-PDCL-green-light block sm:inline">
                    Legal Status:
                  </span>
                  <span className="block sm:inline sm:ml-2">
                    Registered with the Ministry of Health & Family Welfare,
                    People&apos;s Republic Govt. of Bangladesh (License No. 1275
                    & 688)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-first "Our Vision" section */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 max-w-7xl mx-auto">
        <div
          className="glass-medical rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-depth-2 sm:shadow-depth-3 overflow-hidden scroll-fade"
          ref={(el) => (sectionsRef.current[2] = el)}>
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0">
            {/* Content first on mobile for better readability */}
            <div className="order-1 lg:order-2 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 relative">
                <span className="relative z-10">Our Vision</span>
                <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-1 bg-PDCL-green-light rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-10 sm:w-12 h-1 bg-PDCL-green rounded-full animate-pulse"></div>
              </h2>

              {/* Mobile-optimized goal section */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-PDCL-green-light mb-3 sm:mb-4">
                  Our Goal
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg pl-4 sm:pl-6 border-l-4 border-PDCL-green-light/30 leading-relaxed">
                  To establish a referral Diagnostic and Medical Services Centre
                  that sets the benchmark for healthcare excellence.
                </p>
              </div>

              {/* Mobile-first objectives */}
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-PDCL-green-light mb-4 sm:mb-6">
                  Our Objectives
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    "To render world standard diagnostic service at an affordable cost and limit patient outflow abroad.",
                    "Out door basis treatment by renowned General Practitioners, Consultants and Professors.",
                    "To promote Health Education & Medical Services through community engagement.",
                    "Day care Centre for follow-up cardiac, renal and oncology patients.",
                    "To build a full fledged specialized (Tertiary) Hospital with cutting-edge facilities.",
                    "Expand network with Satellite collection Centres nationwide.",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      {/* Mobile-optimized touch target */}
                      <span className="flex-shrink-0 glass-medical text-PDCL-green-light rounded-full p-1.5 sm:p-2 mr-3 sm:mr-4 mt-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed flex-1">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Image section - after content on mobile */}
            <div className="order-2 lg:order-1 p-4 sm:p-6 lg:p-8 xl:p-12 flex items-center">
              <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl w-full">
                <img
                  src={objective}
                  className="w-full h-48 sm:h-64 lg:h-auto object-cover transition-all duration-500 touch-manipulation"
                  alt="Our Vision and Objectives - Healthcare Excellence"
                  loading="lazy"
                  decoding="async"
                  style={{ WebkitBackfaceVisibility: "hidden" }}
                />
                <div className="absolute inset-0 bg-medical-gradient opacity-0 lg:group-hover:opacity-10 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-first Journey Timeline */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-28 lg:px-8 max-w-7xl mx-auto">
        <div
          className="text-center mb-8 sm:mb-12 lg:mb-16 scroll-fade"
          ref={(el) => (sectionsRef.current[3] = el)}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our{" "}
            <span className="text-PDCL-green-light bg-gradient-to-r from-PDCL-green-light to-PDCL-green bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            How we started and grew to serve the nation with excellence in
            healthcare.
          </p>
        </div>

        {/* Mobile-first Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Desktop Timeline Line - hidden on mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-PDCL-green-light to-PDCL-green rounded-full hidden lg:block"></div>

          {/* Mobile Timeline Line */}
          <div className="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-PDCL-green-light to-PDCL-green rounded-full lg:hidden"></div>

          <div className="space-y-8 sm:space-y-12 lg:space-y-24">
            {[
              {
                year: "1983",
                title: "Our Humble Beginnings",
                description:
                  "Started our activities with a vision to revolutionize diagnostic services in Bangladesh.",
                image: goals1,
              },
              {
                year: "2016",
                title: "Expanding Our Reach",
                description:
                  "New branches opened at Badda, Dinajpur and Mirpur to serve more communities across the country.",
                image: mirpur,
              },
              {
                year: "2017",
                title: "Comprehensive Healthcare",
                description:
                  "Started six new 'Model Pharmacies' all over Bangladesh to provide complete healthcare solutions.",
                image: goals3,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative scroll-fade lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${
                  index % 2 === 0 ? "" : "lg:grid-flow-row-dense"
                }`}
                ref={(el) => (sectionsRef.current[4 + index] = el)}>
                {/* Mobile Timeline Node */}
                <div className="absolute left-6 transform -translate-x-1/2 w-4 h-4 bg-PDCL-green-light rounded-full border-2 border-white shadow-medical z-10 lg:hidden mt-6"></div>

                {/* Desktop Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-PDCL-green-light rounded-full border-4 border-white shadow-medical z-10 hidden lg:block animate-pulse"></div>

                {/* Desktop Year Badge */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-16 lg:-translate-y-12 bg-medical-gradient text-white px-6 py-2 rounded-full font-bold text-lg shadow-depth-2 z-20 hidden lg:block">
                  {item.year}
                </div>

                {/* Content Card - Mobile First */}
                <div
                  className={`ml-12 lg:ml-0 glass-medical rounded-xl sm:rounded-2xl lg:rounded-4xl shadow-depth-2 sm:shadow-depth-3 overflow-hidden group ${
                    index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-2"
                  }`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      className="w-full h-48 sm:h-56 lg:h-64 xl:h-80 object-cover object-center transition-all duration-500 touch-manipulation"
                      alt={`${item.year} - ${item.title}`}
                      loading={index > 0 ? "lazy" : "eager"}
                      decoding="async"
                      style={{ WebkitBackfaceVisibility: "hidden" }}
                    />
                    {/* Reduced hover effects for mobile performance */}
                    <div className="absolute inset-0 bg-medical-gradient opacity-0 lg:group-hover:opacity-20 transition-opacity duration-500"></div>

                    {/* Mobile Year Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:hidden bg-medical-gradient text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-depth-2">
                      {item.year}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8">
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Desktop Decorative Elements - Hidden on mobile for performance */}
                <div
                  className={`hidden lg:block ${
                    index % 2 === 0
                      ? "lg:col-start-2 lg:pl-12"
                      : "lg:col-start-1 lg:pr-12"
                  }`}>
                  <div className="flex items-center justify-center h-full">
                    <div className="w-24 xl:w-32 h-24 xl:h-32 bg-gradient-to-br from-PDCL-green-light/10 to-PDCL-green/10 rounded-full flex items-center justify-center">
                      <div className="w-12 xl:w-16 h-12 xl:h-16 bg-gradient-to-br from-PDCL-green-light to-PDCL-green rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 xl:w-8 h-6 xl:h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          {index === 0 && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          )}
                          {index === 1 && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          )}
                          {index === 2 && (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-first CTA Section with iOS safe areas */}
      <section className="py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 max-w-7xl mx-auto">
        <div
          className="bg-medical-gradient rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden scroll-fade"
          ref={(el) => (sectionsRef.current[7] = el)}
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
          {/* Simplified background pattern for mobile performance */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full -translate-x-12 sm:-translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full translate-x-8 sm:translate-x-12 translate-y-8 sm:translate-y-12"></div>
          </div>

          <div className="relative z-10">
            {/* Mobile-first heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              Ready to Experience World-Class Diagnostic Services?
            </h2>
            <p className="text-green-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Join thousands of satisfied patients who trust us for accurate
              diagnostics and compassionate care.
            </p>

            {/* Mobile-first CTA buttons with proper touch targets */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <Link
                to="/contact-us"
                className="w-full sm:w-auto inline-block group"
                aria-label="Contact us today">
                <button className="w-full sm:w-auto bg-white active:bg-gray-100 hover:bg-gray-100 text-PDCL-green-light font-bold py-4 px-8 sm:px-10 rounded-full transition-all duration-300 shadow-depth-3 touch-manipulation min-h-[48px] text-base sm:text-lg">
                  Contact Us Today
                  <svg
                    className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 group-active:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </Link>

              <Link
                to="/our-branches"
                className="w-full sm:w-auto inline-block group"
                aria-label="Find nearest branch">
                <button className="w-full sm:w-auto glass-medical border border-white/30 text-white font-semibold py-4 px-8 sm:px-10 rounded-full transition-all duration-300 active:bg-white/20 hover:bg-white/20 touch-manipulation min-h-[48px] text-base sm:text-lg">
                  Find Nearest Branch
                  <svg
                    className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 group-active:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </button>
              </Link>
            </div>

            {/* Mobile-first Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { number: "40+", label: "Years of Excellence" },
                { number: `${totalBranches}+`, label: "Branches Nationwide" },
                { number: "10M+ /yr", label: "Patients Served" },
                { number: "24/7", label: "Emergency Services" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-green-100 text-xs sm:text-sm font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Goals;
