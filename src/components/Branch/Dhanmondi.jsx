import React, { useEffect, useState, useRef } from "react";
import "@fontsource/ubuntu";
import video from "../../assets/heroVideo.mp4";
import { SearchBoxBranch } from "../../components";
import { branch } from "../../constants/branches";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaFlask,
  FaAward,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { API_TOKEN, BASE_URL } from "../../secrets";
import { buildDoctorPath } from "../../utils/doctorUrl";

const DoctorSlider = ({ doctors, loading }) => {
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setShowArrows(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className="relative py-8"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={handleMouseLeave}>
      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={handleScrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Scroll left">
            <FaChevronLeft className="text-[#00664a] text-xl" />
          </button>
          <button
            onClick={handleScrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Scroll right">
            <FaChevronRight className="text-[#00664a] text-xl" />
          </button>
        </>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 px-4 py-4 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}>
        {loading && doctors.length === 0
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 h-80 bg-gray-100 rounded-xl animate-pulse"
              />
            ))
          : doctors.map((doctor) => {
              return (
                <Link
                  key={doctor.id}
                  to={buildDoctorPath(doctor)}
                  className="doctor-card-link group relative flex-shrink-0 w-64 hover:no-underline">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="relative flex flex-col rounded-xl bg-gradient-to-b from-transparent via-transparent to-[#f0fff0]/80 shadow-md h-full hover:shadow-lg transition-all">
                    {/* Doctor Image */}
                    <div className="relative mx-4 mt-4 h-48 overflow-hidden rounded-xl bg-clip-border text-gray-700 shadow-lg bg-gradient-to-br from-[#f0fff0] to-[#e0f7e0]">
                      {doctor.image ? (
                        <>
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover object-top rounded-xl transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                          <div className="no-image absolute inset-0 justify-center items-center hidden">
                            <FaUserMd className="text-5xl text-[#00664a] opacity-30" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col justify-center items-center">
                          <FaUserMd className="text-5xl text-[#00664a] opacity-30" />
                        </div>
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="p-4 flex-1">
                      <h3 className="text-lg font-bold text-[#00664a] truncate group-hover:text-[#00984a] transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {doctor.degree}
                      </p>
                      <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 transition-colors">
                        <FaUserMd className="mr-2" />
                        <span className="truncate">
                          {doctor.specialists?.[0]?.specialist?.name ||
                            "General Specialist"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
      </div>

      {/* Loading Indicator */}
      {loading && doctors.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00664a]"></div>
        </div>
      )}
    </div>
  );
};

const Dhanmondi = () => {
  const branchInfo = branch.find((b) => b.heading === "Dhanmondi");
  const branchName = branchInfo.heading;
  const branchId = branchInfo.branchID;
  const branchForDoctor = 1;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/doctors?token=${API_TOKEN}&branches=1&page=${pageNum}`
      );
      setDoctors((prev) =>
        pageNum === 1
          ? response.data.data.data
          : [...prev, ...response.data.data.data]
      );
      setTotalPages(response.data.data.last_page);
      setHasMore(pageNum < response.data.data.last_page);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <section className="relative py-16 lg:py-20 bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="relative lg:w-1/2">
          <div className="lg:sticky lg:top-32">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#00664a]">
              Popular Diagnostic Centre{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00664a] via-[#00984a] to-blue-600">
                {branchName}
              </span>{" "}
              Branch.
            </h1>
            <div className="mt-8 w-full">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                <video
                  className="w-full h-full object-cover"
                  alt="Hero Video"
                  src={video}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 mt-0 lg:mt-56">
          <div className="relative mt-8 lg:mt-0">
            <SearchBoxBranch
              branchId={branchId}
              branchForDoctor={branchForDoctor}
            />
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#00664a]">
                Why Choose Our {branchName} Branch?
              </h2>
              <p className="mt-4 text-gray-600">
                As our flagship location since 1983, we offer unparalleled
                diagnostic services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <FaFlask className="text-4xl text-[#00664a]" />,
                  title: "Advanced Technology",
                  description:
                    "State-of-the-art diagnostic equipment for accurate results",
                },
                {
                  icon: <FaUserMd className="text-4xl text-[#00664a]" />,
                  title: "Expert Specialists",
                  description: "200+ renowned doctors across all specialties",
                },
                {
                  icon: <FaAward className="text-4xl text-[#00664a]" />,
                  title: "40 Years of Trust",
                  description: "Pioneers in diagnostic services since 1983",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Doctors Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#00664a]">
                Our Specialist Doctors
              </h2>
              <p className="mt-4 text-gray-600">
                Meet our team of experienced medical professionals
              </p>
            </div>

            <DoctorSlider doctors={doctors} loading={loading} />

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchDoctors(page + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-[#00664a] text-white rounded-lg hover:bg-[#00984a] transition-colors disabled:opacity-50 flex items-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Load More Doctors"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Facilities Section */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#00664a]">
                Our Facilities
              </h2>
              <p className="mt-4 text-gray-600">
                Modern amenities for your comfort and convenience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Advanced Imaging Center",
                  description: "MRI, CT Scan, Digital X-Ray, Ultrasound",
                  icon: "🖼️",
                },
                {
                  title: "Cardiac Care Unit",
                  description: "Echo, ECG, Stress Test, Holter Monitoring",
                  icon: "❤️",
                },
                {
                  title: "Pathology Lab",
                  description: "Fully automated analyzers for accurate results",
                  icon: "🧪",
                },
              ].map((facility, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                  <div className="text-4xl mb-4">{facility.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#00664a]">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600">{facility.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dhanmondi;
