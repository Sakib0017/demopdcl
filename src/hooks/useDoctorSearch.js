import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_TOKEN, BASE_URL } from '../secrets';
import { useDebouncedCallback } from './useDebounce';

const INITIAL_SEARCH_STATE = {
  searchTerm: "",
  selectedBranch: "",
  selectedSpecialization: "",
  selectedDay: "",
};

const INITIAL_DATA_STATE = {
  displayedDoctors: [],
  branches: [],
  specializations: [],
  days: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  isFetchingMore: false,
  initialDataLoaded: false,
};

/**
 * Custom hook for managing doctor search functionality
 * @returns {Object} Doctor search state and methods
 */
export const useDoctorSearch = () => {
  const [searchUI, setSearchUI] = useState(INITIAL_SEARCH_STATE);
  const [searchData, setSearchData] = useState(INITIAL_DATA_STATE);
  const doctorSearchInputRef = useRef(null);

  // Initialize doctor search data (branches, specializations, days)
  const fetchInitialData = useCallback(async () => {
    try {
      const [branchesRes, firstSpecPage, daysRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/branch-for-doctor?token=${API_TOKEN}`),
        axios.get(`${BASE_URL}/api/doctor-speciality?token=${API_TOKEN}&page=1`),
        axios.get(`${BASE_URL}/api/practice-days?token=${API_TOKEN}`),
      ]);

      // /api/doctor-speciality is paginated (81 specialties, 50 per page).
      // Fetching only page 1 left 31 specialties out of this dropdown.
      const specialityRows = [...firstSpecPage.data.data.data];
      const specialityLastPage = firstSpecPage.data.data.last_page;

      if (Number.isInteger(specialityLastPage) && specialityLastPage >= 1) {
        for (let page = 2; page <= specialityLastPage; page += 1) {
          const nextSpecPage = await axios.get(
            `${BASE_URL}/api/doctor-speciality?token=${API_TOKEN}&page=${page}`
          );
          specialityRows.push(...nextSpecPage.data.data.data);
        }
      }

      setSearchData((prev) => ({
        ...prev,
        branches: branchesRes.data.data.data,
        specializations: specialityRows,
        days: daysRes.data.data,
        initialDataLoaded: true,
      }));
    } catch (error) {
      toast.error("Failed to load doctor data. Please try again.");
    }
  }, []);

  // Fetch doctors with filters and pagination
  const fetchDoctors = useCallback(
    async (page = 1, append = false, filters = null) => {
      const {
        selectedBranch,
        selectedSpecialization,
        selectedDay,
        searchTerm,
      } = filters || searchUI;

      const hasActiveFilters =
        selectedBranch || selectedSpecialization || selectedDay || searchTerm;

      try {
        if (!append) {
          setSearchData((prev) => ({
            ...prev,
            loading: hasActiveFilters,
          }));
        } else {
          setSearchData((prev) => ({ ...prev, isFetchingMore: true }));
        }

        const params = {
          token: API_TOKEN,
          page: page,
          ...(searchTerm && { name: searchTerm, fast_search: "yes" }),
          ...(selectedBranch && { branches: selectedBranch }),
          ...(selectedSpecialization && {
            specialities: selectedSpecialization,
          }),
          ...(selectedDay && { days: selectedDay }),
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(
          `${BASE_URL}/api/doctors?${queryString}`
        );

        const newDoctors = response.data.data.data;
        const totalPages = response.data.data.last_page;

        setSearchData((prev) => ({
          ...prev,
          displayedDoctors: append
            ? [...prev.displayedDoctors, ...newDoctors]
            : newDoctors,
          currentPage: page,
          totalPages: totalPages,
          hasMore: page < totalPages,
          loading: false,
          isFetchingMore: false,
        }));

        // Focus input after search (unless appending)
        if (doctorSearchInputRef.current && !append) {
          doctorSearchInputRef.current.focus();
        }
      } catch (error) {
        toast.error("Failed to load doctors. Please try again.");
        setSearchData((prev) => ({
          ...prev,
          loading: false,
          isFetchingMore: false,
        }));
      }
    },
    [searchUI]
  );

  // Debounced search function
  const debouncedSearch = useDebouncedCallback((searchValue) => {
    const filters = {
      ...searchUI,
      searchTerm: searchValue,
    };
    fetchDoctors(1, false, filters);
  }, 500);

  // Handle search term changes
  const handleSearchChange = useCallback((searchValue) => {
    setSearchUI((prev) => ({
      ...prev,
      searchTerm: searchValue,
    }));
    debouncedSearch(searchValue);
  }, [debouncedSearch]);

  // Handle filter changes (branch, specialization, day)
  const handleFilterChange = useCallback(
    (field, value) => {
      if (field === "selectedDay" && value === "Everyday") {
        return;
      }

      setSearchUI((prev) => {
        const newState = { ...prev, [field]: value };
        
        // Debounce filter changes to avoid excessive API calls
        setTimeout(() => {
          fetchDoctors(1, false, newState);
        }, 500);

        return newState;
      });
    },
    [fetchDoctors]
  );

  // Handle infinite scroll
  const handleScroll = useCallback(
    ({ clientHeight, scrollHeight, scrollTop }) => {
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;

      if (
        isNearBottom &&
        !searchData.isFetchingMore &&
        searchData.hasMore
      ) {
        fetchDoctors(searchData.currentPage + 1, true);
      }
    },
    [searchData, fetchDoctors]
  );

  // Reset search state
  const resetSearch = useCallback(() => {
    setSearchUI(INITIAL_SEARCH_STATE);
    setSearchData(prev => ({
      ...prev,
      displayedDoctors: [],
      loading: false,
      currentPage: 1,
      hasMore: false,
      isFetchingMore: false,
    }));
  }, []);

  return {
    // State
    searchUI,
    searchData,
    doctorSearchInputRef,
    
    // Actions
    fetchInitialData,
    handleSearchChange,
    handleFilterChange,
    handleScroll,
    resetSearch,
  };
};