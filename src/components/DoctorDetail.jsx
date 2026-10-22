import "@fontsource/ubuntu";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  drBackground,
  Adecard,
  Ambrosol,
  Amlovas,
  Vonomax,
  Anorel,
  Cebergol,
} from "../assets";
import {
  FaUserMd,
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { MdPeople, MdMedicalServices } from "react-icons/md";
import { legacyApi } from "../services/api/legacyApi";
import { buildDoctorPath } from "../utils/doctorUrl";
import {
  doctorTitle,
  doctorDescription,
  doctorGraph,
  jsonLdScript,
  displayName,
  doctorHeadline,
  doctorFaq,
} from "../utils/doctorSeo";
import { SITE_URL } from "../secrets";
import { motion } from "framer-motion";

// Pharmaceutical ads data for horizontal banner
const pharmaceuticalAds = [
  {
    id: 1,
    name: "Adecard",
    image: Adecard,
    url: "https://www.popular-pharma.com/products/82",
    brandColors: { primary: "text-gray-800", accent: "text-[#ea7726]" },
  },
  {
    id: 2,
    name: "Vonomax",
    image: Vonomax,
    url: "https://www.popular-pharma.com/products/519",
    brandColors: { primary: "text-[#ea7726]", accent: "text-[#087b41]" },
  },
  {
    id: 3,
    name: "Ambrosol",
    image: Ambrosol,
    url: "https://www.popular-pharma.com/products/82",
    brandColors: { primary: "text-gray-800", accent: "text-[#087b41]" },
  },
  {
    id: 4,
    name: "Amlovas",
    image: Amlovas,
    url: "https://www.popular-pharma.com/products/68",
    brandColors: { primary: "text-gray-800", accent: "text-red-700" },
  },
  {
    id: 5,
    name: "Anorel",
    image: Anorel,
    url: "https://www.popular-pharma.com/products/117",
    brandColors: { primary: "text-gray-800", accent: "text-blue-800" },
  },
  {
    id: 6,
    name: "Cebergol",
    image: Cebergol,
    url: "https://www.popular-pharma.com/products/129",
    brandColors: { primary: "text-blue-700", accent: "text-[#ea7726]" },
  },
];

const DoctorDetail = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Canonical route supplies `id`; the legacy /doctordetail/:doctorId route
  // supplies `doctorId`. The detail API response has no id field of its own.
  const doctorId = params.id || params.doctorId;
  const [doctor, setDoctor] = useState(null);
  const [similarDoctors, setSimilarDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [error, setError] = useState(null);
  // Confirmed absence only — distinct from `error`, which covers transient
  // failures (network, timeout, 5xx) that must NOT be told to Google via
  // noindex. See notFoundHead below.
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingSimilar(true);
      setError(null);
      setNotFound(false);
      setDoctor(null);
      setSimilarDoctors([]);

      // No id could be parsed from the route at all — nothing to fetch and
      // no canonical URL to redirect to.
      if (!doctorId) {
        setNotFound(true);
        setLoading(false);
        setLoadingSimilar(false);
        return;
      }

      try {
        const doctorResponse = await legacyApi.get(`/api/doctor/${doctorId}`);

        if (!doctorResponse.data.success) {
          // The API affirmatively says this doctor does not exist.
          setNotFound(true);
          return;
        }

        const doctorData = doctorResponse.data.data;
        setDoctor(doctorData);

        const branchIds =
          doctorData.branches?.map((b) => b.branch_id).join(",") || "";
        const specialistIds =
          doctorData.specialists?.map((s) => s.specialist_id).join(",") || "";

        if (branchIds && specialistIds) {
          try {
            const similarResponse = await legacyApi.get("/api/doctor-suggestions", {
              params: { branches: branchIds, specialities: specialistIds },
            });
            if (similarResponse.data.success) {
              const filteredDoctors = similarResponse.data.data.data.filter(
                (doc) => doc.id.toString() !== doctorId
              );
              setSimilarDoctors(filteredDoctors);
            }
          } catch (err) {
            console.error("Error fetching similar doctors:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        // A confirmed 404 means the doctor genuinely doesn't exist — safe to
        // noindex. Anything else (network error, timeout, 5xx) is
        // transient: Google should retry, not be told to drop the page.
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.message || "Failed to fetch doctor data");
        }
      } finally {
        setLoading(false);
        setLoadingSimilar(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const canonicalPath = doctor ? buildDoctorPath(doctor, doctorId) : null;

  // Rewrite legacy URLs and stale slugs to the canonical path. Without this,
  // /doctors/any/thing/2094 would serve identical content at unlimited URLs.
  // The guard compares pathname only, so carrying the query string/hash
  // through never causes a redirect loop.
  useEffect(() => {
    if (!canonicalPath) return;
    if (location.pathname === canonicalPath) return;
    navigate(
      { pathname: canonicalPath, search: location.search, hash: location.hash },
      { replace: true }
    );
  }, [canonicalPath, location.pathname, location.search, location.hash, navigate]);

  const isDoctorOnLeave = useCallback(() => {
    return doctor?.on_leave === 1;
  }, [doctor]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Static hosting cannot return a real 404, so every bad URL returns 200 OK.
  // Without noindex, Google indexes unlimited identical error pages. Only
  // emit this for a *confirmed* absence — a transient API failure below
  // renders with no robots directive so Google keeps retrying instead of
  // dropping the page.
  const notFoundHead = (
    <Helmet>
      {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
      <title>Popular Diagnostic Centre Ltd. | Doctor Not Found</title>
      */}
      <meta name="robots" content="noindex, follow" />
    </Helmet>
  );

  if (notFound) {
    return (
      <>
        {notFoundHead}
        <div className="text-center py-10">Doctor not found</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
          <title>Popular Diagnostic Centre Ltd. | Doctor profile unavailable</title>
          */}
        </Helmet>
        <div className="text-center py-10 text-red-500">{error}</div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        {notFoundHead}
        <div className="text-center py-10">Doctor not found</div>
      </>
    );
  }

  // Computed once so the visible FAQ section below and the FAQPage
  // structured data in <Helmet> render the exact same questions — Google
  // requires FAQ markup to correspond to Q&A actually visible on the page.
  const faqs = doctorFaq(doctor);

  const formattedChamber = {
    branch: doctor.practicing_branches,
    building: doctor.branches[0]?.map || "Not specified",
    room: "Not specified",
    weekday: doctor.schedule.map((item) => ({
      day: item.day,
      time: `${item.start_time} - ${item.end_time}`,
    })),
    assistantMobile: doctor.branches[0]?.phone || "Not specified",
  };

  const handleClick1 = () => {
    window.open(
      "http://appointment.populardiagnostic.com/appointment",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="doctor-detail bg-gray-100 min-h-screen">
      <Helmet>
        {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
        <title>{doctorTitle(doctor)}</title>
        <meta name="description" content={doctorDescription(doctor)} />
        */}
        <link rel="canonical" href={`${SITE_URL}${canonicalPath}`} />

        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Popular Diagnostic Centre" />
        <meta property="og:title" content={doctorTitle(doctor)} />
        <meta property="og:description" content={doctorDescription(doctor)} />
        <meta property="og:url" content={`${SITE_URL}${canonicalPath}`} />
        {doctor.image && <meta property="og:image" content={doctor.image} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={doctorTitle(doctor)} />
        <meta name="twitter:description" content={doctorDescription(doctor)} />
        {doctor.image && <meta name="twitter:image" content={doctor.image} />}

        <script type="application/ld+json">
          {jsonLdScript(doctorGraph(doctor, SITE_URL, canonicalPath, faqs))}
        </script>
      </Helmet>
      <div className="sm:container mx-auto py-4 md:py-8 px-3 md:px-5">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-3/12 lg:w-4/12 px-2 mb-3 md:mb-4">
            <div className="bg-white p-3 md:p-4 rounded-2xl shadow-depth-3 border-t-4 border-[#00984a] hover:shadow-depth-4 transition-all duration-300 backdrop-blur-sm bg-white/95">
              <div className="relative group overflow-hidden rounded-xl shadow-depth-2 hover:shadow-depth-3 transition-shadow">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00984a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                {doctor.image ? (
                  <img
                    className="h-auto w-full mx-auto transition-transform duration-300 group-hover:scale-105"
                    src={doctor.image}
                    alt={doctor.name}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      backgroundImage: `url(${drBackground})`,
                    }}
                  />
                ) : (
                  <div className="no-image font-ubuntu flex flex-col justify-center items-center p-2 h-60 bg-gray-50">
                    <FaUserMd className="text-6xl text-gray-400" />
                    <p className="text-gray-700 mt-2">No Image Available</p>
                  </div>
                )}
              </div>
              <h1 className="pt-3 text-gray-800 font-bold text-xl leading-tight my-1 font-ubuntu">
                {displayName(doctor)}
              </h1>
              <h2 className="text-gray-600 font-lg font-medium leading-6">
                <MdMedicalServices className="inline mr-1" />
                {doctorHeadline(doctor)}
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:shadow-depth-1 py-2 px-3 mt-3 rounded-xl shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Status</span>
                  <span className="ml-auto">
                    <span
                      className={`py-1.5 px-3 rounded-lg text-white text-sm font-semibold shadow-depth-1 ${
                        isDoctorOnLeave()
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : "bg-gradient-to-r from-[#006642] to-[#00984a]"
                      }`}>
                      {isDoctorOnLeave() ? "On Leave" : "Active"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="my-3 md:my-4"></div>
            <div className="bg-white rounded-2xl shadow-depth-3 p-3 md:p-4 hover:shadow-depth-4 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 md:space-x-3 font-semibold text-gray-900 text-lg md:text-xl leading-8 font-ubuntu mb-2">
                <span className="text-[#00984a]">
                  <MdPeople className="text-xl md:text-2xl" />
                </span>
                <span className="tracking-wide">Similar Doctors</span>
              </div>
              <p className="text-gray-500 text-center text-xs md:text-sm pb-2 md:pb-3">
                For different schedules
              </p>
              <hr className="mb-4 border-gray-200" />
              {loadingSimilar ? (
                <div className="p-5 font-ubuntu text-center text-gray-800">
                  Loading similar doctors...
                </div>
              ) : similarDoctors.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto custom-scroll p-2 -mx-2">
                  {similarDoctors.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-center p-2 rounded-xl hover:bg-gradient-to-br from-[#00984a]/5 to-[#00984a]/5 hover:shadow-depth-1 transition-all duration-200">
                      {/* /api/doctor-suggestions returns only {id, name, image,
                          gender} — no specialists or branches — so
                          buildDoctorPath(doc) alone would fall back to
                          "general-practice" on every suggestion. Suggestions
                          are matched against this doctor's specialist ids, so
                          borrowing the current doctor's specialty is a close
                          approximation; the canonical redirect on the target
                          page remains the backstop for a suggestion matched
                          on a secondary specialty. */}
                      <Link
                        to={buildDoctorPath({ ...doc, specialists: doctor.specialists }, doc.id)}
                        className="block">
                        <div className="relative inline-block mb-2">
                          <img
                            className="h-16 w-16 rounded-full mx-auto object-cover ring-2 ring-gray-100 hover:ring-[#00984a]/30 transition-all shadow-depth-1"
                            src={doc.image}
                            alt={doc.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              // Inline SVG avatar fallback (no network request, can't fail).
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%239ca3af'/%3E%3Cpath d='M12 56c0-11 9-18 20-18s20 7 20 18z' fill='%239ca3af'/%3E%3C/svg%3E";
                            }}
                          />
                          {/* Active indicator dot */}
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-[#00984a] rounded-full border-2 border-white" />
                        </div>
                        <p className="text-xs mt-1 text-gray-700 font-medium line-clamp-2 leading-tight">
                          {doc.name}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-5 font-ubuntu text-center text-gray-800">
                  No similar doctors available
                </div>
              )}
            </div>

            <div className="my-3 md:my-4"></div>

            {/* Featured Medications - sticky so it stays visible while the
                longer right-hand column scrolls past. */}
            <div className="md:sticky md:top-20 z-10">
              <div className="glass-medical rounded-2xl p-3 md:p-4 shadow-depth-2 border border-[#00984a]/20 hover:border-[#00984a]/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#00984a] font-ubuntu">
                      Featured Medications
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-[#00984a]/10 rounded-full text-xs text-[#00984a] font-medium">
                      Popular Pharma
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 italic">Sponsored</span>
                </div>

                {/* Clips the track to the card viewport; the track itself is
                    twice the ad list, animated exactly one copy's width so
                    the loop point is seamless (see .ad-marquee-track). */}
                <div className="overflow-hidden pb-3 pt-1 px-1 -mx-1">
                  <div className="flex gap-3 md:gap-4 ad-marquee-track">
                    {[...pharmaceuticalAds, ...pharmaceuticalAds].map((ad, index) => (
                      <a
                        key={`${ad.id}-${index}`}
                        href={ad.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={index < pharmaceuticalAds.length ? 0 : -1}
                        aria-hidden={index >= pharmaceuticalAds.length}
                        className="flex-shrink-0 w-28 md:w-32">
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white rounded-xl p-2 md:p-3 shadow-depth-1 hover:shadow-depth-3 border border-gray-200 hover:border-[#00984a]/30 transition-all duration-200 h-full flex flex-col">
                          <div className="flex-1 flex items-center justify-center mb-1 md:mb-2">
                            <img
                              src={ad.image}
                              alt={ad.name}
                              className="w-full h-16 md:h-20 object-contain"
                            />
                          </div>
                          <h3 className={`text-xs font-semibold text-center leading-tight ${ad.brandColors.primary}`}>
                            {ad.name}
                          </h3>
                        </motion.div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator - Shows on mobile to indicate more content below */}
            <div className="md:hidden mt-4 flex justify-center">
              <div className="flex flex-col items-center gap-2 text-[#00984a] animate-bounce">
                <span className="text-xs font-medium font-ubuntu">More Info Below</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-full md:w-9/12 lg:w-8/12 px-2">
            <div className="bg-white p-3 md:p-4 shadow-depth-3 rounded-2xl hover:shadow-depth-4 transition-all duration-300">
              <div>
                <p className="p-3 md:p-5 text-center font-ubuntu font-bold text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-[#006642] via-[#00984a] to-[#006642] bg-clip-text text-transparent">
                  {doctor.experience_summery || "Experienced Specialist"}
                </p>
              </div>
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3 pb-2 border-b border-gray-100">
                <span className="text-[#00984a]">
                  <FaUser className="text-lg" />
                </span>
                <span className="tracking-wide text-lg font-ubuntu">About</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <div className="font-semibold flex items-center mb-2 text-[#00984a]">
                      <FaUserMd className="mr-2" /> Degrees
                    </div>
                    <div className="pl-6 text-gray-700 leading-relaxed">{doctor.degree}</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <div className="font-semibold flex items-center mb-2 text-[#00984a]">
                      <FaEnvelope className="mr-2" /> Contact
                    </div>
                    <div className="pl-6">
                      {doctor.email ? (
                        <a
                          className="text-[#00984a] hover:text-[#00984a]/70 hover:underline flex items-center transition-colors duration-200"
                          href={`mailto:${doctor.email}`}>
                          <FaEnvelope className="mr-1" /> {doctor.email}
                        </a>
                      ) : (
                        <span className="text-gray-500">
                          Email not available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#006642] to-[#00984a] text-white text-sm font-semibold rounded-xl hover:shadow-depth-3 focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:ring-offset-2 p-3 md:p-4 my-3 md:my-4 flex items-center justify-center transition-all duration-200 shadow-depth-2"
                onClick={handleClick1}
                type="button">
                <FaCalendarAlt className="mr-2" /> Book an Appointment
              </motion.button>
            </div>
            <div className="my-3 md:my-4"></div>

            <div className="bg-white p-3 md:p-4 shadow-depth-3 rounded-2xl hover:shadow-depth-4 transition-all duration-300">
              <div>
                <div className="flex justify-center items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3 md:mb-4">
                  <span className="text-[#00984a]">
                    <FaMapMarkerAlt className="text-lg md:text-xl" />
                  </span>
                  <span className="tracking-wide text-lg md:text-xl font-ubuntu">Chamber Details</span>
                </div>
                {doctor.absent_message && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">{/* SVG Icon */}</div>
                      <div className="ml-3">
                        <p
                          className="text-sm text-yellow-700"
                          dangerouslySetInnerHTML={{
                            __html: doctor.absent_message,
                          }}></p>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="chambers-grid m-0 p-0 text-black w-full"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "20px",
                  }}>
                  <div className="chamber-card p-3 md:p-5 border-2 border-gray-200 rounded-xl hover:border-[#00984a]/30 hover:shadow-depth-2 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="font-semibold text-base md:text-lg text-center mb-2 text-[#00984a] font-ubuntu">
                      <FaMapMarkerAlt className="inline mr-1 md:mr-2" />
                      {formattedChamber.branch} Branch
                    </h3>
                    <p className="text-center text-sm md:text-base text-gray-600 mb-1">
                      {formattedChamber.building}
                    </p>
                    <p className="text-center text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      <FaPhone className="inline mr-1 md:mr-2 text-[#00984a]" />
                      {formattedChamber.assistantMobile}
                    </p>
                    <div className="text-center font-bold text-gray-800 pt-2 md:pt-3 pb-2 text-lg md:text-xl font-ubuntu border-t border-gray-200">
                      <FaCalendarAlt className="inline mr-1 md:mr-2 text-[#00984a]" />
                      Schedule
                    </div>
                    <div className="overflow-x-auto rounded-xl">
                      <table className="min-w-full text-center bg-white rounded-xl overflow-hidden">
                        <thead className="bg-gradient-to-r from-[#006642] to-[#00984a]">
                          <tr>
                            <th
                              scope="col"
                              className="text-xs md:text-sm font-semibold text-white px-3 md:px-6 py-2 md:py-3">
                              Day
                            </th>
                            <th
                              scope="col"
                              className="text-xs md:text-sm font-semibold text-white px-3 md:px-6 py-2 md:py-3">
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {formattedChamber.weekday.map((day, dayIndex) => (
                            <tr key={dayIndex} className="hover:bg-[#00984a]/5 transition-colors">
                              <td className="text-xs md:text-sm text-gray-900 font-medium px-3 md:px-6 py-2 md:py-3 whitespace-nowrap">
                                {day.day}
                              </td>
                              <td className="text-xs md:text-sm text-gray-700 px-3 md:px-6 py-2 md:py-3 whitespace-nowrap">
                                {day.time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {faqs.length > 0 && (
              <>
                <div className="my-3 md:my-4"></div>
                <div className="bg-white rounded-2xl shadow-depth-3 p-3 md:p-4 hover:shadow-depth-4 transition-all duration-300">
                  <h2 className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3 pb-2 border-b border-gray-100 text-lg font-ubuntu">
                    <span className="text-[#00984a]">
                      <FaQuestionCircle className="text-lg" />
                    </span>
                    <span className="tracking-wide">Frequently Asked Questions</span>
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div key={faq.question}>
                        <h3 className="font-semibold text-gray-900 font-ubuntu mb-1">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
