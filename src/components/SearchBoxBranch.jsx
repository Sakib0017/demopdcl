import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import VirtualizedList from "./ui/VirtualizedList";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/ubuntu";
import { styles } from "../styles";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaFlask,
  FaSearch,
  FaChevronDown,
  FaSpinner,
  FaAngleRight,
  FaInfoCircle,
} from "react-icons/fa";
import { API_TOKEN, BASE_URL } from "../secrets";
import { buildDoctorPath } from "../utils/doctorUrl";


const TABS = [
  { id: "doctors", label: "Doctors", icon: <FaUserMd /> },
  { id: "appointment", label: "Appointment", icon: <FaCalendarCheck /> },
  { id: "test-prices", label: "Test Prices", icon: <FaFlask /> },
];

const ListHeader = ({ columns }) => (
  <div className="flex justify-between px-4 py-3 bg-gray-200 font-bold rounded-t-lg text-gray-700 text-sm md:text-base">
    {columns.map((col, index) => (
      <p key={index} className="flex-1 md:flex-none">
        {col}
      </p>
    ))}
  </div>
);

ListHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ServiceRow = React.memo(({ service, style }) => (
  <motion.li
    style={{ ...style, backgroundColor: "#ffffff" }}
    className="flex justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
    whileHover={{ backgroundColor: "rgba(0, 152, 74, 0.05)" }}>
    <p className="text-gray-700 font-ubuntu flex-1 md:flex-none truncate pr-2">
      {service.name}
    </p>
    <p className="font-medium text-gray-800 font-ubuntu whitespace-nowrap">
      {service.price.toLocaleString("en-BD", {
        style: "currency",
        currency: "BDT",
      })}
    </p>
  </motion.li>
));

ServiceRow.propTypes = {
  service: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  style: PropTypes.object.isRequired,
};

const DoctorRow = React.memo(({ doctor, style }) => {
  const specialties =
    doctor.specialists?.map((s) => s.specialist?.name).join(", ") ||
    "Not specified";

  return (
    <Link to={buildDoctorPath(doctor)} className="w-full">
      <motion.li
        style={{ ...style, backgroundColor: "#ffffff" }}
        className="flex justify-between hover:bg-gray-50 px-4 py-3 transition-colors duration-150 border-b border-gray-100"
        whileHover={{ backgroundColor: "rgba(0, 152, 74, 0.05)" }}>
        <div className="flex items-center flex-1 md:flex-none">
          <p className="text-gray-700 font-ubuntu truncate pr-2">
            {doctor.name}
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-gray-600 font-ubuntu text-sm truncate max-w-[150px] md:max-w-none">
            {specialties}
          </p>
          <FaAngleRight className="ml-2 text-[#00984a] opacity-60" />
        </div>
      </motion.li>
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
};

const LoadingSpinner = ({ text = "", size = "medium" }) => (
  <div className="text-center py-4">
    <div className="flex justify-center items-center space-x-2">
      <FaSpinner
        className={`animate-spin ${
          size === "small" ? "h-4 w-4" : "h-6 w-6"
        } text-[#00984a]`}
      />
      {text && <span className="font-ubuntu text-gray-600">{text}</span>}
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
};

const DoctorList = ({ doctors, isFetchingMore, onScroll }) => (
  <div className="flex flex-col min-h-[200px] shadow-lg rounded-lg overflow-hidden ios-optimized">
    <ListHeader columns={["Doctor Name", "Speciality"]} />
    <VirtualizedList
      items={doctors}
      renderItem={({ index, style, item }) => (
        <DoctorRow doctor={item} style={style} />
      )}
      height={250}
      itemHeight={50}
      overscan={5}
      onScroll={onScroll}
      className="w-full"
    />
    {isFetchingMore && (
      <LoadingSpinner text="Loading more doctors..." size="small" />
    )}
  </div>
);

DoctorList.propTypes = {
  doctors: PropTypes.array.isRequired,
  isFetchingMore: PropTypes.bool.isRequired,
  onScroll: PropTypes.func.isRequired,
};

const ServiceList = ({ services, isFetchingAll }) => (
  <div className="flex flex-col min-h-[220px] shadow-lg rounded-lg overflow-hidden">
    <ListHeader columns={["Service Name", "Service Cost"]} />
    {isFetchingAll && (
      <div className="text-center py-2 text-sm text-gray-500">
        <div className="flex items-center justify-center">
          <FaInfoCircle className="mr-2 text-[#00984a]" />
          <span>Loading more services... ({services.length} loaded)</span>
        </div>
      </div>
    )}
    <VirtualizedList
      items={services}
      renderItem={({ index, style, item }) => (
        <ServiceRow service={item} style={style} />
      )}
      height={250}
      itemHeight={50}
      overscan={5}
      className="w-full"
    />
  </div>
);

ServiceList.propTypes = {
  services: PropTypes.array.isRequired,
  isFetchingAll: PropTypes.bool.isRequired,
};

const SearchBoxBranch = ({ branchId, branchForDoctor }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const searchTimeout = useRef(null);
  const doctorSearchInputRef = useRef(null);
  const serviceSearchInputRef = useRef(null);

  const [doctorSearchUI, setDoctorSearchUI] = useState({
    searchTerm: "",
    selectedSpecialization: "",
    selectedDay: "",
  });

  const [doctorSearchData, setDoctorSearchData] = useState({
    displayedDoctors: [],
    specializations: [],
    days: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    isFetchingMore: false,
    initialDataLoaded: false,
  });

  const [serviceSearchState, setServiceSearchState] = useState({
    services: [],
    allServices: [],
    searchTerm: "",
    loading: false,
    isFetchingAll: false,
    allPagesFetched: false,
    error: null,
  });

  const apiRequest = useCallback(async (endpoint, params = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/${endpoint}`, {
        params: { ...params, token: API_TOKEN },
      });
      return response.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }, []);

  const fetchInitialDoctorData = useCallback(async () => {
    try {
      const [firstSpecPage, daysRes] = await Promise.all([
        apiRequest("doctor-speciality", { page: 1 }),
        apiRequest("practice-days"),
      ]);

      // /api/doctor-speciality is paginated (81 specialties, 50 per page).
      // Fetching only page 1 left 31 specialties out of this dropdown.
      const specialityRows = [...firstSpecPage.data.data];
      const specialityLastPage = firstSpecPage.data.last_page;

      if (Number.isInteger(specialityLastPage) && specialityLastPage >= 1) {
        for (let page = 2; page <= specialityLastPage; page += 1) {
          const nextSpecPage = await apiRequest("doctor-speciality", { page });
          specialityRows.push(...nextSpecPage.data.data);
        }
      }

      setDoctorSearchData((prev) => ({
        ...prev,
        specializations: specialityRows,
        days: daysRes.data,
        initialDataLoaded: true,
      }));
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load doctor data. Please try again.");
    }
  }, [apiRequest]);

  const fetchDoctors = useCallback(
    async (page = 1, append = false, filters = null) => {
      const { selectedSpecialization, selectedDay, searchTerm } =
        filters || doctorSearchUI;

      const hasActiveFilters =
        selectedSpecialization || selectedDay || searchTerm;

      try {
        if (!append) {
          setDoctorSearchData((prev) => ({
            ...prev,
            loading: hasActiveFilters,
          }));
        } else {
          setDoctorSearchData((prev) => ({ ...prev, isFetchingMore: true }));
        }

        const params = {
          page,
          branches: branchForDoctor,
          ...(searchTerm && { name: searchTerm, fast_search: "yes" }),
          ...(selectedSpecialization && {
            specialities: selectedSpecialization,
          }),
          ...(selectedDay && { days: selectedDay }),
        };

        const data = await apiRequest("doctors", params);
        const newDoctors = data.data.data;
        const totalPages = data.data.last_page;

        setDoctorSearchData((prev) => ({
          ...prev,
          displayedDoctors: append
            ? [...prev.displayedDoctors, ...newDoctors]
            : newDoctors,
          currentPage: page,
          totalPages,
          hasMore: page < totalPages,
          loading: false,
          isFetchingMore: false,
        }));

        if (doctorSearchInputRef.current && !append) {
          doctorSearchInputRef.current.focus();
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors. Please try again.");
        setDoctorSearchData((prev) => ({
          ...prev,
          loading: false,
          isFetchingMore: false,
        }));
      }
    },
    [apiRequest, branchForDoctor, doctorSearchUI]
  );

  const debounceSearch = useCallback(
    (searchValue) => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      setDoctorSearchUI((prev) => ({
        ...prev,
        searchTerm: searchValue,
      }));

      searchTimeout.current = setTimeout(() => {
        const filters = {
          ...doctorSearchUI,
          searchTerm: searchValue,
        };
        fetchDoctors(1, false, filters);
      }, 500);
    },
    [doctorSearchUI, fetchDoctors]
  );

  const handleDoctorFilterChange = useCallback(
    (field, value) => {
      if (field === "selectedDay" && value === "Everyday") {
        return;
      }

      setDoctorSearchUI((prev) => {
        const newState = { ...prev, [field]: value };

        if (searchTimeout.current) {
          clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
          fetchDoctors(1, false, newState);
        }, 500);

        return newState;
      });
    },
    [fetchDoctors]
  );

  const handleScroll = useCallback(
    ({ clientHeight, scrollHeight, scrollTop }) => {
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;

      if (
        isNearBottom &&
        !doctorSearchData.isFetchingMore &&
        doctorSearchData.hasMore
      ) {
        fetchDoctors(doctorSearchData.currentPage + 1, true);
      }
    },
    [doctorSearchData, fetchDoctors]
  );

  const fetchAllServices = useCallback(
    async (branchId, initialData = [], totalPages = 1) => {
      try {
        let currentPage = 2;
        let fetchedData = [...initialData];

        while (currentPage <= totalPages) {
          const data = await apiRequest("test-service-charges", {
            branch_id: branchId,
            test_service_category_id: 0,
            page: currentPage,
          });

          fetchedData = [...fetchedData, ...(data.data?.data || [])];
          currentPage++;

          setServiceSearchState((prev) => ({
            ...prev,
            services: fetchedData,
            allServices: fetchedData,
          }));
        }

        setServiceSearchState((prev) => ({
          ...prev,
          isFetchingAll: false,
          allPagesFetched: true,
        }));
      } catch (error) {
        console.error("Error fetching all pages:", error);
        setServiceSearchState((prev) => ({
          ...prev,
          isFetchingAll: false,
          error: "Failed to load all services. Showing partial results.",
        }));
      }
    },
    [apiRequest]
  );

  const fetchInitialServices = useCallback(async () => {
    if (!branchId) {
      setServiceSearchState((prev) => ({
        ...prev,
        error: "Branch ID not provided",
        loading: false,
        isFetchingAll: false,
      }));
      return;
    }

    setServiceSearchState((prev) => ({
      ...prev,
      loading: true,
      isFetchingAll: true,
      allPagesFetched: false,
      error: null,
    }));

    try {
      const data = await apiRequest("test-service-charges", {
        branch_id: branchId,
        test_service_category_id: 0,
        page: 1,
      });

      const firstPageData = data.data?.data || [];
      const totalPages = data.data?.last_page || 1;
      const hasMorePages = totalPages > 1;

      setServiceSearchState((prev) => ({
        ...prev,
        services: firstPageData,
        allServices: firstPageData,
        loading: false,
        isFetchingAll: hasMorePages,
        allPagesFetched: !hasMorePages,
      }));

      if (hasMorePages) {
        fetchAllServices(branchId, firstPageData, totalPages);
      }

      if (serviceSearchInputRef.current) {
        serviceSearchInputRef.current.focus();
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServiceSearchState((prev) => ({
        ...prev,
        loading: false,
        isFetchingAll: false,
        error: "Failed to fetch services. Please try again later.",
      }));
    }
  }, [apiRequest, branchId, fetchAllServices]);

  const handleServiceSearchChange = useCallback((event) => {
    const searchValue = event.target.value.toLowerCase();
    setServiceSearchState((prev) => ({
      ...prev,
      searchTerm: searchValue,
      services: prev.allServices.filter((service) =>
        service.name.toLowerCase().includes(searchValue)
      ),
    }));
  }, []);

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  useEffect(() => {
    if (activeTab === "doctors") {
      fetchInitialDoctorData();
    } else if (activeTab === "test-prices") {
      fetchInitialServices();
    }
  }, [activeTab, fetchInitialDoctorData, fetchInitialServices]);

  const renderDoctorTab = () => (
    <motion.form
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4">
        <div className="relative z-0 w-full col-span-1 md:col-span-3 mb-2 md:mb-3 group">
          <div className="relative">
            <select
              className="block py-2.5 px-4 w-full text-sm rounded-lg shadow-md text-gray-700 bg-white pr-10 border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:border-[#00984a] transition-all duration-200"
              onChange={(e) =>
                handleDoctorFilterChange(
                  "selectedSpecialization",
                  e.target.value
                )
              }
              value={doctorSearchUI.selectedSpecialization}
              disabled={!doctorSearchData.initialDataLoaded}>
              <option value="">Select Specialization</option>
              {doctorSearchData.specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="relative w-full col-span-1 md:col-span-3 mb-2 md:mb-3 group">
          <div className="relative">
            <select
              className="block py-2.5 px-4 w-full text-sm rounded-lg shadow-md text-gray-700 bg-white pr-10 border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:border-[#00984a] transition-all duration-200"
              onChange={(e) =>
                handleDoctorFilterChange("selectedDay", e.target.value)
              }
              value={doctorSearchUI.selectedDay}
              disabled={!doctorSearchData.initialDataLoaded}>
              <option value="">Select Day</option>
              {doctorSearchData.days
                .filter((day) => day !== "Everyday")
                .map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
            </select>
            <FaChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="relative col-span-1 md:col-span-6 mb-3 group">
          <div className="relative">
            <input
              ref={doctorSearchInputRef}
              className="block py-2.5 px-4 w-full text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:border-[#00984a] text-gray-700 bg-white border border-gray-200 placeholder-gray-500 pl-10 transition-all duration-200"
              type="text"
              placeholder="Search by doctor's name..."
              value={doctorSearchUI.searchTerm}
              onChange={(e) => debounceSearch(e.target.value)}
              disabled={!doctorSearchData.initialDataLoaded}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {doctorSearchData.loading ? (
            <LoadingSpinner text="Loading doctors..." />
          ) : doctorSearchData.displayedDoctors.length > 0 ? (
            <DoctorList
              doctors={doctorSearchData.displayedDoctors}
              isFetchingMore={doctorSearchData.isFetchingMore}
              onScroll={handleScroll}
            />
          ) : (
            (doctorSearchUI.searchTerm ||
              doctorSearchUI.selectedSpecialization ||
              doctorSearchUI.selectedDay) && (
              <div className="text-center py-6 bg-white rounded-lg shadow-lg">
                <FaInfoCircle className="mx-auto mb-2 text-2xl text-gray-400" />
                <p className="text-gray-600">
                  No doctors found matching your criteria
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </motion.form>
  );

  const renderAppointmentTab = () => (
    <motion.div
      className="max-w-screen-xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <div className="grid grid-cols-1">
        <div className="relative z-0 col-span-1 w-full group">
          <Link
            to="http://appointment.populardiagnostic.com/appointment"
            target="_blank"
            rel="noopener noreferrer">
            <motion.button
              type="button"
              className="text-white w-full rounded-lg block col-span-1 mb-2 h-[50px] bg-[#00984a] border-none focus:ring-4 focus:outline-none focus:ring-green-300 font-ubuntu text-lg font-bold px-5 py-2.5 text-center flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <FaCalendarCheck className="mr-2" />
              Make An Appointment
              <span className="ml-1 relative">
                <span className="absolute top-0 right-0 -mr-1 -mt-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Now
              </span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const renderTestPricesTab = () => (
    <motion.form
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <div className="grid grid-cols-1">
        <div className="relative col-span-1 mb-3 group">
          <div className="relative">
            <input
              ref={serviceSearchInputRef}
              type="text"
              value={serviceSearchState.searchTerm}
              onChange={handleServiceSearchChange}
              placeholder="Search test prices..."
              className="block py-2.5 px-4 w-full text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#00984a] focus:border-[#00984a] text-gray-700 bg-white border border-gray-200 placeholder-gray-500 pl-10 transition-all duration-200"
              required
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            {serviceSearchState.isFetchingAll && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <FaSpinner className="animate-spin h-4 w-4 text-[#00984a]" />
              </div>
            )}
          </div>

          {serviceSearchState.loading ? (
            <LoadingSpinner text="Loading services..." />
          ) : serviceSearchState.error ? (
            <div className="text-center py-4 text-red-500 bg-white rounded-lg shadow-lg mt-4">
              <FaInfoCircle className="mx-auto mb-2 text-2xl" />
              <p>{serviceSearchState.error}</p>
            </div>
          ) : serviceSearchState.services.length > 0 ? (
            <ServiceList
              services={serviceSearchState.services}
              isFetchingAll={serviceSearchState.isFetchingAll}
            />
          ) : (
            <div className="text-center py-6 bg-white rounded-lg shadow-lg mt-4">
              <FaInfoCircle className="mx-auto mb-2 text-2xl text-gray-400" />
              <p className="text-gray-600">
                {serviceSearchState.searchTerm
                  ? "No matching services found"
                  : "No services available for this branch"}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.form>
  );

  return (
    <div
      className={`${styles.paddingX} md:-mt-[250px] -mt-[50px] bg-gradient-to-t from-transparent to-white/90 to-40% rounded-t-2xl pt-4 flex relative z-10 max-w-7xl mx-auto justify-center items-bottom text-center flex-col text-gray-900`}>
      <div className="mb-4">
        <ul className="text-sm font-medium text-center text-gray-900 grid grid-cols-3 sm:flex">
          {TABS.map((tab) => (
            <li key={tab.id} className="p-1 focus-within:z-10">
              <motion.button
                type="button"
                className={`inline-flex items-center justify-center w-full p-3 shadow-lg rounded-lg border border-gray-100 ${
                  activeTab === tab.id
                    ? "bg-white text-[#00984a] font-semibold"
                    : "bg-[#00984a] text-white"
                } transition-all duration-200`}
                onClick={() => handleTabClick(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}>
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      <div id="search-tab-content" className="w-full">
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

SearchBoxBranch.propTypes = {
  branchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default SearchBoxBranch;
