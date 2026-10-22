import React from "react";
import "@fontsource/ubuntu";
import { DrMostafizurRahman } from "../assets"; // Ensure this is correctly imported

const ManagingDirector = () => {
  return (
    <div className="bg-gradient-to-b from-[#F5FFFA] to-white min-h-screen">
      <section className="relative py-16 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Executive <span className="text-[#00984a]">Leadership</span>
          </h1>
          <p className="text-lg text-gray-600">
            Driving healthcare innovation through visionary leadership
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="w-full flex flex-col h-[900px] md:flex-row">
            {/* Left: Image Section */}
            <div className="relative p-6 sm:p-8 lg:p-10  flex items-center justify-center md:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="relative w-full  max-w-md">
                <div className="absolute -inset-8 sm:-inset-12 blur-2xl opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full animate-pulse duration-7000"></div>
                </div>

                <div className="relative z-10 mx-auto w-48 h-48  sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={DrMostafizurRahman}
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

                <div className="text-center mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Dr. Mostafizur Rahman
                  </h2>
                  <p className="text-[#00984a] text-lg sm:text-xl font-medium mt-2">
                    Managing Director
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Text/Bio Section */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col md:w-1/2  justify-start overflow-y-auto custom-scroll">
              <div className="prose prose-sm sm:prose-base md:prose-lg text-gray-600 max-w-none">
                <p className="mb-6 leading-relaxed">
                  Popular started its journey as diagnostic centre in June 1983
                  with a promise to render the possible standard service to the
                  people of the country at an affordable cost and in turn to
                  limit the outflow of the patient abroad at the expense of hard
                  earned foreign currency.
                </p>

                <div className="bg-[#00984a]/10 border-l-4 border-[#00984a] p-4 rounded-r-lg mb-6">
                  <p className="text-[#00984a] font-medium italic">
                    "When I started working in pathology department of Dhaka
                    Medical College Hospital, I saw that thousands of people of
                    our country are going to abroad every year only for
                    treatment. The country was losing millions of taka worth
                    foreign currency. That time I felt, as a Doctor I must do
                    something about it. I had the spirit but didn't have the
                    resources. From that inspiration I started Popular
                    Diagnostic."
                  </p>
                </div>

                <p className="mb-6 leading-relaxed">
                  Bangladesh is a developing country. We have tremendous scope
                  and potentiality in our industry especially in health sector.
                  Basically my father was a Doctor. None of my family members
                  were engaged in business. My dream was to be a surgeon. But
                  necessity and circumstances force me to start diagnostic
                  business.
                </p>

                <p className="mb-6 leading-relaxed">
                  Challenges and problems are many. But solving strategies are
                  very few and precise. As a businessman we should relentlessly
                  concern about our commitment and quality.
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 bg-[#00984a]/10 text-[#00984a] rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>
                      Founded in 1983 to prevent foreign currency drain from
                      medical tourism
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 bg-[#00984a]/10 text-[#00984a] rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>
                      Pioneer in bringing world-class diagnostic services to
                      Bangladesh
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 bg-[#00984a]/10 text-[#00984a] rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>
                      Committed to skilled manpower development and quality
                      service
                    </span>
                  </li>
                </ul>

                <p className="mb-6 leading-relaxed">
                  To achieve the goal and ensure the quality service need highly
                  skilled manpower who will continue to produce high level
                  productivity relentlessly maintaining high standard of medical
                  services. I always hire the skilled manpower and motivate
                  them. Being an entrepreneur of a health services provider
                  organization I always concern to ensure the right man in the
                  right place.
                </p>

                <p className="leading-relaxed">
                  I believe that if a person whether he is a doctor or not works
                  hard, has merit, good behaviour and remains honest, he will be
                  a successful businessman. Success is nothing but a goal of
                  achievement. In an every success has positive productivity,
                  which is dedicated for the welfare of mankind. Almighty God,
                  Honorable Doctors and my beloved colleagues are always
                  inspired me to do good and take challenges. My all afford to
                  happy them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mt-16 bg-gradient-to-r from-[#00984a] to-[#007a3d] rounded-2xl p-8 sm:p-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Management Philosophy
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Core principles that guide our leadership approach
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="text-3xl font-bold mb-2">Quality</div>
              <div className="text-sm">First in all services</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="text-3xl font-bold mb-2">People</div>
              <div className="text-sm">Our greatest asset</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
              <div className="text-3xl font-bold mb-2">Innovation</div>
              <div className="text-sm">Continuous improvement</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagingDirector;
