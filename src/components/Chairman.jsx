import { useEffect, useRef } from "react";
import "@fontsource/ubuntu";
import { LateTaheraAkhter } from "../assets";

const Chairman = () => {
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
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen overflow-x-hidden">
      {/* Mobile-first hero section with iOS safe areas */}
      <section 
        className="relative pt-16 pb-8 px-4 sm:pt-20 sm:pb-12 md:pt-28 md:pb-16 lg:px-8 max-w-7xl mx-auto"
        style={{ paddingTop: "max(4rem, env(safe-area-inset-top))" }}
      >
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 scroll-fade" ref={(el) => (sectionsRef.current[0] = el)}>
          <h1 className="text-3xl leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Leadership{" "}
            <span className="text-PDCL-green-light bg-gradient-to-r from-PDCL-green-light to-PDCL-green bg-clip-text text-transparent">
              Legacy
            </span>
          </h1>
          <p className="text-lg leading-relaxed sm:text-xl md:text-2xl text-gray-600 font-light px-2 sm:px-0">
            Visionary leadership that transformed healthcare in Bangladesh
          </p>
        </div>


        <div className="glass-medical rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-depth-3 overflow-hidden scroll-fade hover-lift-lg" ref={(el) => (sectionsRef.current[1] = el)}>
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0">
            {/* Mobile-first image section */}
            <div className="order-1 lg:order-1 relative p-6 sm:p-8 lg:p-10 xl:p-12 flex items-center justify-center bg-gradient-to-br from-green-50/50 to-emerald-50/50">
              <div className="relative w-full max-w-md">
                {/* Enhanced glow effect for large screens */}
                <div className="absolute -inset-6 sm:-inset-8 lg:-inset-12 blur-2xl opacity-20 lg:opacity-30 hidden sm:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-PDCL-green-light to-PDCL-green rounded-full animate-pulse"></div>
                </div>

                {/* Profile image with iOS optimizations */}
                <div className="relative z-10 mx-auto w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border-4 border-white shadow-depth-3 overflow-hidden flex items-center justify-center group">
                  <img
                    src={LateTaheraAkhter}
                    alt="Late Tahera Akhter - Visionary Chairman of PDCL"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                    style={{ WebkitBackfaceVisibility: "hidden" }}
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-PDCL-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Enhanced title section */}
                <div className="text-center mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Late Tahera Akhter
                  </h2>
                  <p className="text-PDCL-green-light text-lg sm:text-xl font-semibold">
                    Visionary Chairman
                  </p>
                  {/* Legacy badge */}
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-PDCL-green-light/10 text-PDCL-green text-sm font-medium">
                    Founder & Visionary
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-first content section */}
            <div className="order-2 lg:order-2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
              <div className="max-w-none">
                {/* Mobile-optimized story */}
                <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-600 leading-relaxed">
                  After the liberation war, Bangladesh&apos;s health sector was in
                  disarray due to political instability. Tragically, many lives
                  were lost to incomplete diagnoses and inadequate treatment.
                  Recognizing this crisis, we established Popular Diagnostic
                  Centre Ltd. in Elephant Road, Dhaka, with a singular mission:
                  to bring modern diagnostic facilities to the people of
                  Bangladesh.
                </p>

                {/* Enhanced quote section */}
                <div className="glass-medical border-l-4 border-PDCL-green-light p-4 sm:p-6 rounded-r-2xl mb-6 sm:mb-8 hover-lift">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-PDCL-green-light mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <p className="text-PDCL-green text-base sm:text-lg font-medium italic leading-relaxed">
                      Our vision was clear - to create a healthcare institution
                      that would set new standards in diagnostic accuracy and
                      patient care.
                    </p>
                  </div>
                </div>

                <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-600 leading-relaxed">
                  Since its inception in June 1983, Popular quickly became
                  synonymous with reliability and trust, earning the confidence
                  of both medical professionals and patients nationwide. We
                  pioneered the introduction of cutting-edge medical technology
                  in Bangladesh&apos;s private sector, continually upgrading our
                  facilities to ensure precise diagnoses.
                </p>

                {/* Enhanced achievements list */}
                <ul className="space-y-4 mb-6 sm:mb-8">
                  {[
                    "First private diagnostic center with world-class medical equipment",
                    "Commitment to affordable, high-quality diagnostic services", 
                    "Reducing government healthcare burden through private sector excellence"
                  ].map((achievement, index) => (
                    <li key={index} className="flex items-start group">
                      <span className="flex-shrink-0 glass-medical text-PDCL-green-light rounded-full p-2 mr-4 mt-1 group-hover:bg-PDCL-green-light group-hover:text-white transition-all duration-300 min-h-[32px] min-w-[32px] flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300 flex-1">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Today, Popular Diagnostic Centre remains committed to its
                  founding principles - delivering world-standard healthcare
                  services at affordable costs, making &ldquo;Health for All&rdquo; not just
                  a slogan but a tangible reality for the people of Bangladesh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced legacy section with mobile-first design */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-medical-gradient rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden scroll-fade" ref={(el) => (sectionsRef.current[2] = el)} style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
          {/* Background pattern for large screens */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full -translate-x-12 sm:-translate-x-16 -translate-y-12 sm:-translate-y-16 animate-float"></div>
            <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full translate-x-8 sm:translate-x-12 translate-y-8 sm:translate-y-12 animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Continuing the Vision
            </h3>
            <p className="text-green-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              The legacy of Late Tahera Akhter lives on through our unwavering
              commitment to healthcare excellence
            </p>
            
            {/* Mobile-first statistics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { number: "40+", label: "Years of Service", icon: "🏥" },
                { number: "100+", label: "Advanced Diagnostics", icon: "🔬" },
                { number: "10M+", label: "Patients Served Annually", icon: "❤️" }
              ].map((stat, index) => (
                <div key={index} className="glass-medical border border-white/20 rounded-2xl p-4 sm:p-6 hover-lift touch-manipulation transition-all duration-300">
                  <div className="text-2xl sm:text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-green-100 text-sm sm:text-base font-medium leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Call to action */}
            <div className="mt-8 sm:mt-12">
              <p className="text-green-100 text-sm sm:text-base mb-4">
                Honor her legacy by continuing to serve Bangladesh with excellence
              </p>
              <div className="w-16 h-1 bg-white rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom spacing with iOS safe area */}
      <div style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }} />
    </div>
  );
};

export default Chairman;
