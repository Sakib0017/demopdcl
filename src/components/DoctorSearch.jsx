import React, { useState, useEffect, useMemo, useRef } from "react";
import "@fontsource/ubuntu";
import { motion } from "framer-motion";
import axios from "axios";
import Select from "react-select";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import { BASE_URL, API_TOKEN } from "../secrets";
import { slugify } from "../utils/doctorUrl";
import DoctorCard from "./DoctorCard";

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

const selectStyles = {
  control: (base) => ({ ...base, borderColor: "#00984a", "&:hover": { borderColor: "#00984a" }, minHeight: "44px", boxShadow: "none", borderRadius: "0.5rem" }),
  multiValue: (base) => ({ ...base, backgroundColor: "#d7ffd7", borderRadius: "0.375rem" }),
  multiValueLabel: (base) => ({ ...base, color: "#00984a", fontWeight: "500" }),
  multiValueRemove: (base) => ({ ...base, color: "#00984a", ":hover": { backgroundColor: "#00984a", color: "white" } }),
  option: (base, { isFocused, isSelected }) => ({ ...base, backgroundColor: isSelected ? "#00984a" : isFocused ? "#d7ffd7" : "white", color: isSelected ? "white" : "#00984a" }),
};

const DoctorSearch = () => {
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [branches, setBranches] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialMount = useRef(true);
  // Every search shares one results list, so the last response to land wins —
  // not the last one asked for. Arriving on /our-doctors?specialty=dentist
  // fires the unfiltered first load and the filtered one within 500ms of each
  // other, and whenever the unfiltered reply was the slower of the two it
  // replaced the dentists with the full list while the dropdown still read
  // "Dentist". Stamping each request and dropping any reply that is no longer
  // the newest covers the filter and typing races too.
  const requestSeq = useRef(0);
  const [searchParams] = useSearchParams();
  const specialtyParam = searchParams.get("specialty");
  const hasAppliedSpecialtyParam = useRef(false);
  // The mount effect below only needs the slug the page was opened with, and
  // reading it through a ref keeps that effect off the searchParams identity —
  // depending on it would re-run the branch, speciality and day loads too.
  const initialSpecialtyParam = useRef(specialtyParam);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        toast.info("Loading doctors...", { autoClose: 2000 });

        const branchesRes = await axios.get(
          `${BASE_URL}/api/branch-for-doctor?token=${API_TOKEN}`
        );
        setBranches(branchesRes.data.data.data);

        // /api/doctor-speciality is paginated (81 specialties, 50 per page).
        // Fetching only page 1 left 31 specialties out of the dropdown and made
        // ~1/3 of /doctors/{specialty} URLs resolve to no ID and land unfiltered.
        const firstSpecPage = await axios.get(
          `${BASE_URL}/api/doctor-speciality?token=${API_TOKEN}&page=1`
        );
        const specialityRows = [...firstSpecPage.data.data.data];
        const specialityLastPage = firstSpecPage.data.data.last_page;

        if (Number.isInteger(specialityLastPage)) {
          for (let page = 2; page <= specialityLastPage; page += 1) {
            const nextSpecPage = await axios.get(
              `${BASE_URL}/api/doctor-speciality?token=${API_TOKEN}&page=${page}`
            );
            specialityRows.push(...nextSpecPage.data.data.data);
          }
        }

        setSpecializations(specialityRows);

        const daysRes = await axios.get(
          `${BASE_URL}/api/practice-days?token=${API_TOKEN}`
        );
        setDays(daysRes.data.data);

        // With ?specialty= in the URL, the filtered fetch further down is the
        // one that matters. Firing an unfiltered one here as well raced it —
        // and this one is issued last, so it won: the dropdown read "Dentist"
        // while the list underneath was every consultant in the centre.
        if (!initialSpecialtyParam.current) {
          await fetchDoctors(true);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load data. Please try again.");
        // The speciality list never arrived, so the filtered fetch can't run.
        // Fall back to the full list rather than leaving the page empty.
        if (initialSpecialtyParam.current) {
          fetchDoctors(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchDoctors = async (reset = false) => {
    const seq = (requestSeq.current += 1);
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentPage = reset ? 1 : page;

      const params = {
        token: API_TOKEN,
        page: currentPage,
      };

      if (searchTerm) {
        params.name = searchTerm;
        params.fast_search = "yes";
      }

      if (selectedBranches.length > 0) {
        params.branches = selectedBranches.map((b) => b.value).join(",");
      }

      if (selectedSpecializations.length > 0) {
        params.specialities = selectedSpecializations
          .map((s) => s.value)
          .join(",");
      }

      if (selectedDays.length > 0) {
        params.days = selectedDays.map((d) => d.value).join(",");
      }

      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `${BASE_URL}/api/doctors?${queryString}`
      );

      if (seq !== requestSeq.current) return;

      if (reset) {
        setDisplayedDoctors(response.data.data.data);
        setPage(1);
        if (response.data.data.data.length === 0) {
          toast.info("No doctors found matching your criteria", {
            autoClose: 3000,
          });
        }
      } else {
        setDisplayedDoctors((prev) => [...prev, ...response.data.data.data]);
      }

      setHasMore(
        response.data.data.current_page < response.data.data.last_page
      );
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (seq === requestSeq.current) {
        toast.error("Failed to load doctors. Please try again.");
      }
    } finally {
      // A superseded request must not clear the spinner the newest one turned
      // on — that one clears it when it lands.
      if (seq === requestSeq.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchDoctors(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedBranches, selectedSpecializations, selectedDays]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight - 100 ||
        loading ||
        loadingMore ||
        !hasMore
      ) {
        return;
      }

      setPage((prev) => prev + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchDoctors();
    }
  }, [page]);

  const branchOptions = useMemo(
    () => branches.map((branch) => ({ value: branch.id, label: branch.name })),
    [branches]
  );

  const specializationOptions = useMemo(
    () =>
      specializations.map((spec) => ({ value: spec.id, label: spec.name })),
    [specializations]
  );

  // A visitor arriving from /doctors/cardiology should land on filtered
  // results. Runs once, after the specialization list resolves.
  useEffect(() => {
    if (hasAppliedSpecialtyParam.current) return;
    if (!specialtyParam || specializationOptions.length === 0) return;

    const match = specializationOptions.find(
      (option) => slugify(option.label) === specialtyParam
    );
    hasAppliedSpecialtyParam.current = true;
    // Setting the filter triggers the fetch effect below. An unrecognised
    // slug has no filter to set, so it needs the plain list fetched here —
    // the initial load skipped it on account of the param.
    if (match) setSelectedSpecializations([match]);
    else fetchDoctors(true);
  }, [specialtyParam, specializationOptions]);

  const dayOptions = useMemo(
    () => days.map((day) => ({ value: day, label: day })),
    [days]
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <Helmet>
        {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
        <title>Popular Diagnostic Centre Ltd. | Find Specialist Doctors & Book Appointments</title>
        <meta
          name="description"
          content="Search experienced specialist doctors and consultants by branch, specialty or name at Popular Diagnostic Centre Ltd. and book appointments easily."
        />
        */}
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="pt-24 pb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-800 font-ubuntu mb-2"
          >
            Our Expert Consultants
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Find and book appointments with our highly qualified medical
            specialists
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="sticky top-16 z-20 bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  type="text"
                  placeholder="Search by doctor's name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
            </div>

            <div>
              <Select
                options={branchOptions}
                isMulti
                placeholder="All Branches"
                value={selectedBranches}
                onChange={setSelectedBranches}
                styles={selectStyles}
                className="text-green-700"
              />
            </div>

            <div>
              <Select
                options={specializationOptions}
                isMulti
                placeholder="All Specializations"
                value={selectedSpecializations}
                onChange={setSelectedSpecializations}
                styles={selectStyles}
                className="text-green-700"
              />
            </div>

            <div>
              <Select
                options={dayOptions}
                isMulti
                placeholder="All Days"
                value={selectedDays}
                onChange={setSelectedDays}
                styles={selectStyles}
                className="text-green-700"
              />
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12 max-w-screen-xl mx-auto">
              {displayedDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full sm:w-auto"
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center pb-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}

            {!loading && displayedDoctors.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search filters or search for a different
                  name.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
