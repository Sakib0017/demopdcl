import React from "react";
import "@fontsource/ubuntu";
import { SardinRahman } from "../assets";

const Dmd = () => {
  return (
    <div className="bg-gradient-to-b from-[#F5FFFA] to-white min-h-screen">
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Executive <span className="text-[#00984a]">Leadership</span>
          </h1>
          <p className="text-lg text-gray-600">
            Driving technological excellence in healthcare services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative p-8 lg:p-10 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-8 sm:-inset-12 blur-2xl opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full animate-pulse duration-7000"></div>
                </div>

                <div className="relative z-10 mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={SardinRahman}
                    alt="Sardin Rahman"
                    className="w-full h-full object-cover"
                    style={{
                      imageRendering: "optimizeQuality",
                      transform: "scale(1.0)",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                    loading="lazy"
                  />
                </div>

                <div className="text-center mt-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Sardin Rahman
                  </h2>
                  <p className="text-[#00984a] text-xl font-medium mt-2">
                    Deputy Managing Director
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="prose prose-lg text-gray-600 max-w-none">
                <div className="bg-[#00984a]/10 border-l-4 border-[#00984a] p-6 rounded-lg text-center">
                  <p className="text-[#00984a] font-medium italic">
                    "Message will be updated soon"
                  </p>
                </div>

                <div className="mt-8 space-y-4 opacity-75">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mt-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mt-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#00984a] to-[#007a3d] rounded-2xl p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Tech-Driven Values
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Principles powering our digital transformation in healthcare
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105 hover:bg-white/15">
              <div className="text-3xl font-bold mb-2">🚀 Innovation</div>
              <div className="text-sm">Pioneering healthcare technology</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105 hover:bg-white/15">
              <div className="text-3xl font-bold mb-2">💡 Digital</div>
              <div className="text-sm">Smart solutions for better care</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105 hover:bg-white/15">
              <div className="text-3xl font-bold mb-2">⚡ Energy</div>
              <div className="text-sm">Dynamic, fast-paced execution</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:scale-105 hover:bg-white/15">
              <div className="text-3xl font-bold mb-2">🤝 Collaboration</div>
              <div className="text-sm">Building tech partnerships</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-4 opacity-90">
            <div className="animate-bounce" style={{ animationDelay: "0.1s" }}>
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z" />
              </svg>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.3s" }}>
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z" />
              </svg>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.5s" }}>
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z" />
              </svg>
            </div>
            <p className="text-sm font-medium">
              Modernizing healthcare through technology...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dmd;
