import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import BranchIcon from "../assets/branchIcon.webp";
import { reportDownload } from "../constants/branches";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BranchCard = React.memo(({ branch, onReportDownload }) => {
  const handleClick = useCallback(() => {
    onReportDownload(branch.downloadLink);
  }, [branch.downloadLink, onReportDownload]);

  return (
    <motion.div
      className="m-2 w-full h-full rounded-xl sm:w-[160px] transition-all duration-300 ease-in-out overflow-hidden shadow-lg"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 20px rgba(0, 152, 74, 0.15)",
        scale: 1.02,
      }}
      aria-labelledby={`branch-${branch.braID}-title`}>
      <div
        className="h-full flex flex-col cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}>
        <div className="flex flex-col flex-grow p-4 justify-center items-center w-full h-full bg-gradient-to-br from-[#ffffff] to-[#a7e4c7] rounded-xl border-2 border-[#b0e0cb]">
          <div className="h-20 w-20 mb-3 p-2 bg-gradient-to-tr from-[#e0f7ed] to-[#b0e0cb] rounded-full flex items-center justify-center shadow-inner">
            <img
              src={BranchIcon}
              alt=""
              className="w-full h-full object-contain"
              loading="lazy"
              width="80"
              height="80"
              aria-hidden="true"
            />
          </div>
          <h3
            id={`branch-${branch.braID}-title`}
            className="text-center font-bold text-[#007a3d]">
            {branch.braName}
          </h3>
          <p className="text-xs text-gray-600 mt-1">{branch.braCity}</p>
        </div>
      </div>
    </motion.div>
  );
});

BranchCard.propTypes = {
  branch: PropTypes.shape({
    braID: PropTypes.string.isRequired,
    braName: PropTypes.string.isRequired,
    braCity: PropTypes.string.isRequired,
    downloadLink: PropTypes.string.isRequired,
  }).isRequired,
  onReportDownload: PropTypes.func.isRequired,
};

BranchCard.displayName = "BranchCard";

const EmptyState = React.memo(() => (
  <div className="text-center py-8 bg-[#f0faf5] rounded-lg p-6 shadow-inner">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="mt-2 text-gray-600">No branches found.</p>
  </div>
));

EmptyState.displayName = "EmptyState";

const ReportDownload = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [branches, setBranches] = useState({
    dhaka: [],
    others: [],
  });

  useEffect(() => {
    const dhaka = reportDownload.filter((branch) => branch.braCity === "Dhaka");
    const others = reportDownload.filter(
      (branch) => branch.braCity !== "Dhaka"
    );
    setBranches({ dhaka, others });
  }, []);

  const [filteredDhakaBranches, filteredOtherBranches] = useMemo(() => {
    const filterFn = (branch) =>
      branch.braName.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

    return [branches.dhaka.filter(filterFn), branches.others.filter(filterFn)];
  }, [branches, debouncedSearchTerm]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleReportDownload = useCallback((reportDownloadLink) => {
    try {
      window.open(reportDownloadLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open report link:", error);
    }
  }, []);

  const renderBranchSection = (title, branches) => (
    <>
      <h2 className="text-[#007a3d] text-center text-2xl font-bold mb-8 pb-2 border-b-2 border-[#d0f0e0]">
        {title}
      </h2>
      {branches.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 grid-rows-1">
          {branches.map((branch) => (
            <BranchCard
              key={branch.braID}
              branch={branch}
              onReportDownload={handleReportDownload}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );

  return (
    <div className="bg-gradient-to-b from-[#f5fbf8] to-[#e0f2eb] min-h-screen">
      <div className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-[#007a3d] pb-2 text-4xl font-bold font-ubuntu mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            EMPOWERING PATIENTS: THE PATIENT PORTAL
          </motion.h2>
          <motion.h2
            className="text-gray-600 text-2xl font-bold font-ubuntu mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            ONLINE REPORT DOWNLOAD
          </motion.h2>

          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search branches..."
                className="w-full px-4 py-3 border-2 border-[#c0e8d5] text-[#007a3d] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:border-transparent placeholder-[#7daf97] shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search branches"
              />
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-[#7daf97]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#d0f0e0]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            {renderBranchSection(
              "Branches Inside Dhaka",
              filteredDhakaBranches
            )}
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#d0f0e0]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            {renderBranchSection(
              "Branches Outside Dhaka",
              filteredOtherBranches
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReportDownload);
