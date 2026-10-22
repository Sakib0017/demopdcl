import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "@fontsource/ubuntu";
import { styles } from "../styles";
import { reportDownload } from "../constants/branches";

// Custom hooks
import { useDoctorSearch } from "../hooks/useDoctorSearch";
import { useServiceSearch } from "../hooks/useServiceSearch";
import {
  useDoctorSearchOptimization,
  useServiceSearchOptimization,
} from "../hooks/useSearchOptimization";

// UI Components
import SearchInput from "./ui/SearchInput";
import CustomSelect from "./ui/CustomSelect";
import VirtualizedList from "./ui/VirtualizedList";
import SearchSuggestions from "./ui/SearchSuggestions";
import LoadingSkeleton, {
  DoctorListSkeleton,
  ServiceListSkeleton,
} from "./ui/LoadingSkeleton";
import { buildDoctorPath } from "./utils/doctorUrl";

const TABS = [
  { id: "doctors", label: "Doctors" },
  { id: "appointment", label: "Appointment" },
  { id: "test-prices", label: "Test Prices" },
];

// Utility Components
const ListHeader = ({ columns }) => (
  <div className="hidden md:flex px-6 py-4 bg-gradient-to-r from-[#00664a] to-[#00984a] text-white font-semibold rounded-t-xl md:rounded-t-xl rounded-t-none shadow-sm">
    <div className="flex-1 pr-4">
      <p className="text-sm md:text-base font-ubuntu tracking-wide">
        {columns[0]}
      </p>
    </div>
    <div className="flex-1 text-right">
      <p className="text-sm md:text-base font-ubuntu tracking-wide">
        {columns[1]}
      </p>
    </div>
  </div>
);

ListHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ServiceRow = React.memo(({ service, style, index }) => (
  <li
    style={style}
    className={`block md:flex md:items-center px-4 md:px-6 py-4 hover:bg-gradient-to-r hover:from-[#00984a]/8 hover:to-transparent border-b border-gray-200/60 last:border-b-0 transition-all duration-200 cursor-pointer group ${
      index % 2 === 0 ? "bg-white" : "bg-gray-50"
    }`}>
    {/* Mobile: Vertical card layout */}
    <div className="block md:hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-3">
          <p className="text-gray-800 font-ubuntu font-semibold text-base group-hover:text-[#00664a] transition-colors duration-200 leading-tight">
            {service.name}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500 font-ubuntu mr-2">
              Price:
            </span>
            <p className="font-bold text-[#00984a] font-ubuntu text-base">
              ৳{service.price.toLocaleString("en-BD")}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Desktop: Horizontal two-column layout */}
    <div className="hidden md:flex md:items-center md:w-full">
      <div className="flex-1 pr-4">
        <p className="text-gray-800 font-ubuntu font-medium text-sm md:text-base group-hover:text-[#00664a] transition-colors duration-200 truncate">
          {service.name}
        </p>
      </div>
      <div className="flex-1 text-right">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-xs text-gray-500 font-ubuntu">BDT</span>
          <p className="font-bold text-[#00984a] font-ubuntu text-sm md:text-base">
            {service.price.toLocaleString("en-BD")}
          </p>
        </div>
      </div>
    </div>
  </li>
));

ServiceRow.propTypes = {
  service: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const DoctorRow = React.memo(({ doctor, style, index }) => {
  const specialties =
    doctor.specialists?.map((s) => s.specialist?.name).join(", ") ||
    "Not specified";

  return (
    <Link to={buildDoctorPath(doctor)} className="block">
      <li
        style={style}
        className={`block md:flex md:items-center px-4 md:px-6 py-4 hover:bg-gradient-to-r hover:from-[#00984a]/8 hover:to-transparent border-b border-gray-200/60 last:border-b-0 transition-all duration-200 cursor-pointer group hover:shadow-sm ${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}>
        {/* Mobile: Vertical card layout */}
        <div className="block md:hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <p className="text-gray-800 font-ubuntu font-semibold text-base group-hover:text-[#00664a] transition-colors duration-200 leading-tight">
                {doctor.name}
              </p>
              <p className="text-gray-600 font-ubuntu text-sm mt-1 group-hover:text-gray-700 transition-colors duration-200 leading-relaxed">
                {specialties}
              </p>
            </div>
            <div className="flex-shrink-0 ml-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
              <svg
                className="w-5 h-5 text-[#00984a]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal two-column layout */}
        <div className="hidden md:flex md:items-center md:w-full">
          <div className="flex-1 pr-4">
            <p className="text-gray-800 font-ubuntu font-medium text-sm md:text-base group-hover:text-[#00664a] transition-colors duration-200 truncate">
              {doctor.name}
            </p>
          </div>
          <div className="flex-1 text-right pr-3">
            <p className="text-gray-600 font-ubuntu text-xs md:text-sm group-hover:text-gray-700 transition-colors duration-200">
              {specialties}
            </p>
          </div>
          <div className="w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <svg
              className="w-4 h-4 text-[#00984a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </li>
    </Link>
  );
});

DoctorRow.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    specialists: PropTypes.array,
  }).isRequired,
  style: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const LoadingSpinner = ({ text = "", size = "medium" }) => (
  <div className="text-center py-4">
    <div className="flex justify-center items-center space-x-2">
      <div
        className={`animate-spin rounded-full ${
          size === "small" ? "h-4 w-4 border-b-2" : "h-8 w-8 border-b-2"
        } border-[#00984a]`}></div>
      {text && <span>{text}</span>}
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
};

const DoctorList = ({ doctors, isFetchingMore, onScroll }) => (
  <div className="flex flex-col min-h-[200px] ios-optimized mt-4">
    <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
      <ListHeader columns={["Doctor Name", "Speciality"]} />
      <VirtualizedList
        items={doctors}
        renderItem={({ index, style, item }) => (
          <DoctorRow doctor={item} style={style} index={index} />
        )}
        height={280}
        itemHeight={64}
        overscan={5}
        onScroll={onScroll}
        className="w-full rounded-t-xl md:rounded-t-none"
      />
    </div>
    {isFetchingMore && (
      <div className="mt-3">
        <LoadingSpinner text="Loading more doctors..." size="small" />
      </div>
    )}
  </div>
);

DoctorList.propTypes = {
  doctors: PropTypes.array.isRequired,
  isFetchingMore: PropTypes.bool.isRequired,
  onScroll: PropTypes.func.isRequired,
};

const ServiceList = ({ services, isLoading }) => (
  <div className="flex flex-col min-h-[220px] ios-optimized mt-4">
    <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
      <ListHeader columns={["Service Name", "Service Cost"]} />
      {isLoading && (
        <div className="text-center py-4 text-sm text-gray-500 bg-gray-50/50">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00984a]"></div>
            <span>Loading services...</span>
          </div>
        </div>
      )}
      <VirtualizedList
        items={services}
        renderItem={({ index, style, item }) => (
          <ServiceRow service={item} style={style} index={index} />
        )}
        height={280}
        itemHeight={64}
        overscan={5}
        className="w-full rounded-t-xl md:rounded-t-none"
      />
    </div>
  </div>
);

ServiceList.propTypes = {
  services: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

// Main Search Component
const Search = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // Custom hooks for search functionality
  const {
    searchUI: doctorSearchUI,
    searchData: doctorSearchData,
    doctorSearchInputRef,
    fetchInitialData: fetchDoctorInitialData,
    handleSearchChange: handleDoctorSearchChange,
    handleFilterChange: handleDoctorFilterChange,
    handleScroll: handleDoctorScroll,
  } = useDoctorSearch();

  const {
    serviceState: serviceSearchState,
    serviceSearchInputRef,
    handleBranchChange: handleServiceBranchChange,
    handleSearchChange: handleServiceSearchChange,
  } = useServiceSearch();

  // Phase 3: Search suggestions and optimization state
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [localServiceSearchTerm, setLocalServiceSearchTerm] = useState("");

  // Smart suggestion function for doctor titles
  const getDoctorSuggestions = (searchTerm) => {
    const term = searchTerm.toLowerCase().trim();

    // If empty or just spaces, return empty (quick filters will be shown)
    if (!term) return [];

    const titleSuggestions = [];

    // Smart matching for partial keywords - show full titles in suggestions
    if ("professor".startsWith(term) || "prof".startsWith(term)) {
      titleSuggestions.push("Professor");
    }
    if ("associate".startsWith(term) || "asso".startsWith(term)) {
      titleSuggestions.push("Associate Professor");
    }
    if ("assistant".startsWith(term) || "asst".startsWith(term)) {
      titleSuggestions.push("Assistant Professor");
    }
    if ("doctor".startsWith(term) || "dr".startsWith(term)) {
      titleSuggestions.push("Doctor");
    }

    // Get search history from the optimization hook
    const historySearches = doctorSearchOptimization.searchHistory.filter(
      (history) => history.toLowerCase().includes(term)
    );

    // Combine title suggestions and history, remove duplicates
    return [...new Set([...titleSuggestions, ...historySearches])];
  };

  // Map suggestion text to actual search field value
  const mapSuggestionToSearchValue = (suggestion) => {
    const mappings = {
      Professor: "Prof. ",
      "Associate Professor": "Asso. ",
      "Assistant Professor": "Asst. ",
      Doctor: "Dr. ",
    };

    return mappings[suggestion] || suggestion;
  };

  // Doctor search optimization (for search history functionality)
  const doctorSearchFunction = useCallback((_term, _filters, _options) => {
    // This would connect to actual search API - for now return empty
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 100);
    });
  }, []);
  const doctorSearchOptimization =
    useDoctorSearchOptimization(doctorSearchFunction);

  // Quick filters for doctor search - Show full titles, but insert abbreviated forms
  const doctorQuickFilters = [
    { label: "Professor", value: "Prof. ", icon: "🎓" },
    { label: "Associate Professor", value: "Asso. ", icon: "👨‍🏫" },
    { label: "Assistant Professor", value: "Asst. ", icon: "👩‍🏫" },
    { label: "Doctor", value: "Dr. ", icon: "🩺" },
  ];

  // Smart keyword toggle function
  const handleDoctorKeywordToggle = (selectedKeyword) => {
    const currentTerm = doctorSearchUI.searchTerm;
    const keywordValue = selectedKeyword.value;

    // Check if the current term starts with this keyword
    if (currentTerm.startsWith(keywordValue)) {
      // If same keyword is clicked, remove it
      const nameAfterKeyword = currentTerm.substring(keywordValue.length);
      handleDoctorSearchChange(nameAfterKeyword);
    } else {
      // Check if current term starts with any other keyword and replace it
      let nameAfterKeyword = currentTerm;
      doctorQuickFilters.forEach((filter) => {
        if (currentTerm.startsWith(filter.value)) {
          nameAfterKeyword = currentTerm.substring(filter.value.length);
        }
      });

      // Add the new keyword with the name part
      handleDoctorSearchChange(keywordValue + nameAfterKeyword);
    }

    setShowDoctorSuggestions(false);
  };

  // Service search optimization
  const serviceSearchFunction = useCallback((term, _filters, _options) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          [`${term} Test`, `${term} Scan`, `Complete ${term} Package`].filter(
            (suggestion) =>
              suggestion.toLowerCase().includes(term.toLowerCase())
          )
        );
      }, 100);
    });
  }, []);
  const serviceSearchOptimization = useServiceSearchOptimization(
    serviceSearchFunction
  );

  // Optimized service search handlers to separate UI updates from API calls
  const handleServiceInputChange = useCallback(
    (value) => {
      // Immediate UI update - no lag
      setLocalServiceSearchTerm(value);
      setShowServiceSuggestions(
        value.length > 0 && serviceSearchState.selectedBranch
      );

      // Debounced API call
      handleServiceSearchChange(value);
    },
    [handleServiceSearchChange, serviceSearchState.selectedBranch]
  );

  const handleServiceInputFocus = useCallback(() => {
    setShowServiceSuggestions(
      localServiceSearchTerm.length > 0 && serviceSearchState.selectedBranch
    );
  }, [localServiceSearchTerm, serviceSearchState.selectedBranch]);

  const handleServiceInputBlur = useCallback(() => {
    setTimeout(() => setShowServiceSuggestions(false), 150);
  }, []);

  // Memoized className to prevent recalculation on every render
  const serviceInputClassName = useMemo(() => {
    const baseClass = "mobile-search-input";
    const conditionalClass = !serviceSearchState.selectedBranch
      ? "opacity-50 cursor-not-allowed"
      : "";
    return `${baseClass} ${conditionalClass}`;
  }, [serviceSearchState.selectedBranch]);

  // Sync local search term with actual search term when branch changes or search is cleared
  useEffect(() => {
    setLocalServiceSearchTerm(serviceSearchState.searchTerm);
  }, [serviceSearchState.searchTerm, serviceSearchState.selectedBranch]);

  // Memoized search suggestions to prevent recalculation on every render
  const serviceSuggestions = useMemo(() => {
    return serviceSearchOptimization.getSearchSuggestions(
      localServiceSearchTerm
    );
  }, [serviceSearchOptimization, localServiceSearchTerm]);

  // Quick filters for service search
  const serviceQuickFilters = [
    { label: "CBC, ESR", value: "CBC, ESR", icon: "🩸" },
    { label: "X-Ray", value: "X-Ray", icon: "📷" },
    { label: "MRI", value: "MRI", icon: "🔬" },
    { label: "CT Scan", value: "CT Scan", icon: "📊" },
  ];

  // Initialize doctor data when switching to doctors tab
  useEffect(() => {
    if (activeTab === "doctors") {
      fetchDoctorInitialData();
    }
  }, [activeTab, fetchDoctorInitialData]);

  // Transform data for SelectDropdown components
  const branchOptions = useMemo(
    () =>
      doctorSearchData.branches.map((branch) => ({
        value: branch.id,
        label: branch.name,
      })),
    [doctorSearchData.branches]
  );

  const specializationOptions = useMemo(
    () =>
      doctorSearchData.specializations.map((spec) => ({
        value: spec.id,
        label: spec.name,
      })),
    [doctorSearchData.specializations]
  );

  const dayOptions = useMemo(
    () =>
      doctorSearchData.days
        .filter((day) => day !== "Everyday")
        .map((day) => ({
          value: day,
          label: day,
        })),
    [doctorSearchData.days]
  );

  const serviceBranchOptions = useMemo(
    () =>
      reportDownload.map((branch) => ({
        value: branch.braID,
        label: branch.braName,
      })),
    [reportDownload]
  );

  // Popular branches for better mobile UX
  const popularBranches = [1, 2, 3, 4, 5, 6]; // Dhanmondi, Shantinagar, Uttara, Mirpur, Shyamoli, Badda

  // Render functions for each tab
  const renderDoctorTab = () => (
    <form className="max-w-7xl mx-auto search-form-mobile">
      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 gap-3">
        <div className="relative col-span-12 md:col-span-4 form-group">
          <CustomSelect
            value={doctorSearchUI.selectedBranch}
            onChange={(e) =>
              handleDoctorFilterChange("selectedBranch", e.target.value)
            }
            options={branchOptions}
            placeholder="Select Branch"
            disabled={!doctorSearchData.initialDataLoaded}
            searchable={true}
            showPopularFirst={true}
            popularOptions={popularBranches}
            className="w-full"
          />
        </div>

        <div className="relative col-span-12 md:col-span-4 form-group">
          <CustomSelect
            value={doctorSearchUI.selectedSpecialization}
            onChange={(e) =>
              handleDoctorFilterChange("selectedSpecialization", e.target.value)
            }
            options={specializationOptions}
            placeholder="Select Specialization"
            disabled={!doctorSearchData.initialDataLoaded}
            searchable={true}
            className="w-full"
          />
        </div>

        <div className="relative col-span-12 md:col-span-4 form-group">
          <CustomSelect
            value={doctorSearchUI.selectedDay}
            onChange={(e) =>
              handleDoctorFilterChange("selectedDay", e.target.value)
            }
            options={dayOptions}
            placeholder="Select Day"
            disabled={!doctorSearchData.initialDataLoaded}
            searchable={false}
            className="w-full"
          />
        </div>

        <div className="relative col-span-12 form-group">
          <SearchInput
            ref={doctorSearchInputRef}
            value={doctorSearchUI.searchTerm}
            onChange={(e) => {
              handleDoctorSearchChange(e.target.value);
              // Always show suggestions when there's focus, regardless of content
              setShowDoctorSuggestions(true);
            }}
            onFocus={() => setShowDoctorSuggestions(true)}
            onBlur={() =>
              setTimeout(() => setShowDoctorSuggestions(false), 150)
            }
            placeholder="Search by doctor's name..."
            disabled={!doctorSearchData.initialDataLoaded}
            className="mobile-search-input"
          />

          {/* Search Suggestions */}
          <SearchSuggestions
            suggestions={getDoctorSuggestions(doctorSearchUI.searchTerm)}
            quickFilters={doctorQuickFilters}
            onSuggestionSelect={(suggestion) => {
              // Map suggestion display text to actual search field value
              const searchValue = mapSuggestionToSearchValue(suggestion);
              handleDoctorSearchChange(searchValue);
              setShowDoctorSuggestions(false);
            }}
            onQuickFilterSelect={handleDoctorKeywordToggle}
            isVisible={showDoctorSuggestions && !doctorSearchData.loading}
            currentTerm={doctorSearchUI.searchTerm}
            showQuickFilters={true}
          />

          {doctorSearchData.loading ? (
            <DoctorListSkeleton count={3} />
          ) : doctorSearchData.displayedDoctors.length > 0 ? (
            <DoctorList
              doctors={doctorSearchData.displayedDoctors}
              isFetchingMore={doctorSearchData.isFetchingMore}
              onScroll={handleDoctorScroll}
            />
          ) : (
            (doctorSearchUI.searchTerm ||
              doctorSearchUI.selectedBranch ||
              doctorSearchUI.selectedSpecialization ||
              doctorSearchUI.selectedDay) && (
              <div className="mt-4">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden search-list-empty">
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 font-ubuntu">
                      No doctors found
                    </h3>
                    <p className="text-gray-500 text-sm font-ubuntu">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </form>
  );

  const renderAppointmentTab = () => (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid md:grid-cols-12 md:gap-1">
        <div className="relative z-0 col-span-12 w-full group">
          <Link
            to="http://appointment.populardiagnostic.com/appointment"
            target="_blank"
            rel="noopener noreferrer">
            <button
              type="button"
              className="text-gray-600 w-full rounded block col-span-12 mb-2 h-[43px] hover:text-gray-900 border bg-white shadow-2xl border-none focus:ring-4 focus:outline-none focus:ring-[#00984a] font-ubuntu text-[16px] font-bold px-5 py-2.5 text-center">
              Make An Appointment <span className="animate-ping">Now</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderTestPricesTab = () => (
    <form className="max-w-7xl mx-auto search-form-mobile">
      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 gap-3">
        <div className="relative col-span-12 form-group">
          <CustomSelect
            value={serviceSearchState.selectedBranch || ""}
            onChange={(e) => handleServiceBranchChange(e.target.value)}
            options={serviceBranchOptions}
            placeholder="Select Branch"
            searchable={true}
            showPopularFirst={true}
            popularOptions={popularBranches}
            className="w-full"
          />
        </div>

        <div className="relative col-span-12 form-group">
          <div className="relative">
            <SearchInput
              ref={serviceSearchInputRef}
              value={localServiceSearchTerm}
              onChange={(e) => handleServiceInputChange(e.target.value)}
              onFocus={handleServiceInputFocus}
              onBlur={handleServiceInputBlur}
              placeholder={
                !serviceSearchState.selectedBranch
                  ? "Select a branch first to start searching..."
                  : "Search test prices..."
              }
              disabled={!serviceSearchState.selectedBranch}
              className={serviceInputClassName}
            />

            {/* Search Suggestions for Services */}
            <SearchSuggestions
              suggestions={serviceSuggestions}
              quickFilters={serviceQuickFilters}
              onSuggestionSelect={(suggestion) => {
                handleServiceInputChange(suggestion);
                setShowServiceSuggestions(false);
              }}
              onQuickFilterSelect={(filter) => {
                handleServiceInputChange(filter.label);
                setShowServiceSuggestions(false);
              }}
              isVisible={
                showServiceSuggestions &&
                !serviceSearchState.loading &&
                serviceSearchState.selectedBranch
              }
              currentTerm={localServiceSearchTerm}
            />

            {(serviceSearchState.loading ||
              serviceSearchState.isFetchingAll) && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <LoadingSkeleton
                  variant="default"
                  width="w-4"
                  height="h-4"
                  className="animate-spin rounded-full border-2 border-gray-200 border-t-PDCL-green"
                />
              </div>
            )}
          </div>

          {serviceSearchState.loading ? (
            <ServiceListSkeleton count={5} />
          ) : serviceSearchState.error ? (
            <div className="mt-4">
              <div className="bg-white rounded-xl shadow-lg border border-red-200/50 overflow-hidden">
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2 font-ubuntu">
                    Error loading services
                  </h3>
                  <p className="text-red-500 text-sm font-ubuntu">
                    {serviceSearchState.error}
                  </p>
                </div>
              </div>
            </div>
          ) : serviceSearchState.selectedBranch ? (
            <>
              {!serviceSearchState.searchTerm && (
                <div className="text-center py-2 text-sm text-gray-500">
                  {serviceSearchState.isFetchingAll
                    ? `Loading services... (${serviceSearchState.totalCount} loaded)`
                    : serviceSearchState.allPagesFetched
                    ? `All ${serviceSearchState.totalCount} services loaded`
                    : `${serviceSearchState.totalCount} services loaded`}
                </div>
              )}
              {serviceSearchState.services.length > 0 ? (
                <ServiceList
                  services={serviceSearchState.services}
                  isLoading={
                    serviceSearchState.loading ||
                    serviceSearchState.isFetchingAll
                  }
                />
              ) : (
                <div className="mt-4">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden search-list-empty">
                    <div className="px-6 py-12 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2 font-ubuntu">
                        {serviceSearchState.searchTerm
                          ? "No matching services"
                          : "No services available"}
                      </h3>
                      <p className="text-gray-500 text-sm font-ubuntu">
                        {serviceSearchState.searchTerm
                          ? "Try a different search term"
                          : "No services available for this branch"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </form>
  );

  return (
    <div
      className={`${styles.paddingX} search-35-percent-coverage bg-gradient-to-t from-transparent to-white/80 to-40% rounded-t-2xl pt-4 flex relative z-10 max-w-7xl mx-auto justify-center items-bottom text-center flex-col text-gray-900 safe-area-top ios-optimized`}>
      <div className="mb-4">
        <ul className="text-sm font-medium text-center text-gray-900 sm:flex">
          {TABS.map((tab) => (
            <li key={tab.id} className="w-full p-1 focus-within:z-10">
              <button
                type="button"
                className={`inline-block w-full p-3 shadow-2xl rounded text-gray-900 border-r border-gray-200 ${
                  activeTab === tab.id
                    ? "bg-[#ffffff] text-gray-900"
                    : "bg-[#00984a] text-white"
                }`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div id="search-tab-content">
        {activeTab === "doctors" && (
          <div
            className="p-2 rounded"
            role="tabpanel"
            aria-labelledby="doctors-tab">
            {renderDoctorTab()}
          </div>
        )}

        {activeTab === "appointment" && (
          <div
            className="p-2 rounded"
            role="tabpanel"
            aria-labelledby="appointment-tab">
            {renderAppointmentTab()}
          </div>
        )}

        {activeTab === "test-prices" && (
          <div
            className="p-2 rounded"
            role="tabpanel"
            aria-labelledby="test-prices-tab">
            {renderTestPricesTab()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
