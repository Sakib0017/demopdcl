import { useState, useCallback, useRef } from 'react';
import { useDebouncedCallback } from './useDebounce';
import { fetchServiceCharges, fetchAllServicePages } from '../services/serviceService';
import { reportDownload } from '../constants/branches';

const INITIAL_SERVICE_STATE = {
  selectedBranch: null,
  services: [],
  allServices: [],
  searchTerm: "",
  loading: false,
  isFetchingAll: false,
  isFetchingMore: false, // For infinite scroll
  allPagesFetched: false,
  error: null,
  totalCount: 0,
  hasMore: false, // Track if more pages available
  currentPage: 1, // Track current page for infinite scroll
};

/**
 * Custom hook for managing service search functionality
 * @returns {Object} Service search state and methods
 */
export const useServiceSearch = () => {
  const [serviceState, setServiceState] = useState(INITIAL_SERVICE_STATE);
  const serviceSearchInputRef = useRef(null);

  // AbortController for cancelling ongoing requests
  const abortControllerRef = useRef(null);

  // Track active branch to ignore stale responses
  const activeBranchIdRef = useRef(null);

  // Fetch all pages of services for a branch
  const fetchAllPages = useCallback(
    async (branchId, branch, initialData, totalPages, branchSessionId) => {
      try {
        const result = await fetchAllServicePages({
          branchId,
          branch,
          startPage: 2,
          endPage: totalPages,
          signal: abortControllerRef.current?.signal,
          onPageFetched: ({ allServices }) => {
            // Ignore updates from previous branches
            if (activeBranchIdRef.current !== branchSessionId) {
              return;
            }

            setServiceState((prev) => ({
              ...prev,
              allServices,
              services: prev.searchTerm ? prev.services : allServices,
              totalCount: allServices.length,
            }));
          },
        });

        // Ignore results from previous branches
        if (activeBranchIdRef.current !== branchSessionId) {
          return;
        }

        if (result.success) {
          const allServices = [...initialData, ...result.data];
          setServiceState((prev) => ({
            ...prev,
            allServices,
            services: prev.searchTerm ? prev.services : allServices,
            totalCount: allServices.length,
            isFetchingAll: false,
            allPagesFetched: true,
            hasMore: false, // All pages fetched
          }));
        } else {
          setServiceState((prev) => ({
            ...prev,
            isFetchingAll: false,
            allPagesFetched: true,
            hasMore: false,
            error: result.error || "Failed to load all services. Showing partial results.",
          }));
        }
      } catch (err) {
        // Ignore abort errors - they're expected when switching branches
        if (err.name === 'AbortError') {
          return;
        }

        // Ignore updates from previous branches
        if (activeBranchIdRef.current !== branchSessionId) {
          return;
        }

        setServiceState((prev) => ({
          ...prev,
          isFetchingAll: false,
          error: "Failed to load all services. Showing partial results.",
        }));
      }
    },
    []
  );

  // Handle branch selection change
  const handleBranchChange = useCallback(async (compositeKey) => {
    // Abort any ongoing requests from previous branch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this branch
    abortControllerRef.current = new AbortController();

    // Generate unique session ID for this branch selection
    const branchSessionId = `${compositeKey}_${Date.now()}`;
    activeBranchIdRef.current = branchSessionId;

    setServiceState((prev) => ({
      ...prev,
      selectedBranch: compositeKey,
      services: [],
      allServices: [],
      searchTerm: "",
      loading: !!compositeKey,
      isFetchingAll: !!compositeKey,
      allPagesFetched: false,
      totalCount: 0,
      error: null,
    }));

    if (!compositeKey) return;

    try {
      // Parse composite key to get braID and braName
      const [braIdStr, braName] = compositeKey.split('::');
      const branchId = parseInt(braIdStr, 10);

      // Find branch object from reportDownload using both braID and braName
      const branch = reportDownload.find(
        b => b.braID === branchId && b.braName === braName
      );

      // Fetch first page using service layer
      const result = await fetchServiceCharges({
        branchId,
        branch,
        page: 1,
        categoryId: 0,
        signal: abortControllerRef.current.signal,
      });

      if (!result.success) {
        setServiceState((prev) => ({
          ...prev,
          loading: false,
          isFetchingAll: false,
          error: result.error || "Failed to fetch services. Please try again later.",
        }));
        return;
      }

      const firstPageData = result.data;
      const hasMore = result.pagination.hasMore || false;
      const lastPage = result.pagination.lastPage;

      // Both APIs now provide lastPage (Akhil API uses count field as total pages)
      const totalPages = lastPage || 1;

      setServiceState((prev) => ({
        ...prev,
        services: firstPageData,
        allServices: firstPageData,
        loading: false,
        totalCount: firstPageData.length,
        hasMore,
        currentPage: 1,
      }));

      // If there are more pages, fetch them in the background
      if (totalPages > 1 || hasMore) {
        fetchAllPages(branchId, branch, firstPageData, totalPages, branchSessionId);
      } else {
        setServiceState((prev) => ({
          ...prev,
          isFetchingAll: false,
          allPagesFetched: true,
          hasMore: false,
        }));
      }

      // Focus search input after branch selection
      if (serviceSearchInputRef.current) {
        serviceSearchInputRef.current.focus();
      }
    } catch (err) {
      // Ignore abort errors - they're expected when switching branches
      if (err.name === 'AbortError') {
        return;
      }

      setServiceState((prev) => ({
        ...prev,
        loading: false,
        isFetchingAll: false,
        error: "Failed to fetch services. Please try again later.",
      }));
    }
  }, [fetchAllPages]);

  // Debounced service search with optimized state updates
  const debouncedServiceSearch = useDebouncedCallback(
    async (searchValue) => {
      if (!serviceState.selectedBranch) return;

      // Batch initial state updates
      // Stop background pagination when user starts searching
      setServiceState((prev) => ({
        ...prev,
        searchTerm: searchValue,
        loading: !!searchValue,
        isFetchingAll: false, // Stop background pagination immediately
        error: null, // Clear previous errors
      }));

      try {
        if (!searchValue) {
          // If search is cleared, show all services - single state update
          setServiceState((prev) => ({
            ...prev,
            services: prev.allServices,
            searchTerm: "", // Explicitly clear search term
            loading: false,
            isFetchingAll: false, // Don't restart background fetch
          }));
          return;
        }

        // Parse composite key to get braID and braName
        const [braIdStr, braName] = serviceState.selectedBranch.split('::');
        const branchId = parseInt(braIdStr, 10);

        // Find branch object from reportDownload using both braID and braName
        const branch = reportDownload.find(
          b => b.braID === branchId && b.braName === braName
        );

        // Perform API search using service layer
        const result = await fetchServiceCharges({
          branchId,
          branch,
          page: 1,
          categoryId: 0,
          searchTerm: searchValue,
          signal: abortControllerRef.current?.signal,
        });

        if (result.success) {
          // Single state update with search results
          setServiceState((prev) => ({
            ...prev,
            services: result.data,
            loading: false,
            isFetchingAll: false, // Ensure background fetch stopped
            allPagesFetched: false, // Search results != all pages
            hasMore: result.pagination.hasMore || false, // Track if search has more pages
            currentPage: 1, // Reset to page 1 for search results
            totalCount: result.data.length,
            error: null,
          }));
        } else {
          // Handle API error
          setServiceState((prev) => ({
            ...prev,
            loading: false,
            isFetchingAll: false,
            error: result.error || "Failed to search services. Please try again.",
            services: [],
          }));
        }
      } catch (err) {
        // Ignore abort errors - they're expected when switching branches or searches
        if (err.name === 'AbortError') {
          return;
        }

        // Single error state update
        setServiceState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to search services. Please try again.",
          services: [], // Clear services on error
        }));
      }
    },
    300 // Reduced debounce time for faster response
  );

  // Handle search input change
  const handleSearchChange = useCallback((searchValue) => {
    debouncedServiceSearch(searchValue);
  }, [debouncedServiceSearch]);

  // Reset service search state
  const resetServiceSearch = useCallback(() => {
    setServiceState(INITIAL_SERVICE_STATE);
  }, []);

  // Fetch next page for infinite scroll
  const fetchNextPage = useCallback(async (page) => {
    if (!serviceState.selectedBranch) return;

    setServiceState((prev) => ({ ...prev, isFetchingMore: true }));

    try {
      // Parse composite key to get braID and braName
      const [braIdStr, braName] = serviceState.selectedBranch.split('::');
      const branchId = parseInt(braIdStr, 10);

      // Find branch object from reportDownload
      const branch = reportDownload.find(
        b => b.braID === branchId && b.braName === braName
      );

      const result = await fetchServiceCharges({
        branchId,
        branch,
        page,
        categoryId: 0,
        signal: abortControllerRef.current?.signal,
      });

      if (result.success) {
        setServiceState((prev) => ({
          ...prev,
          services: [...prev.services, ...result.data],
          allServices: [...prev.allServices, ...result.data],
          currentPage: page,
          hasMore: result.pagination.hasMore || false,
          isFetchingMore: false,
          totalCount: prev.totalCount + result.data.length,
        }));
      } else {
        setServiceState((prev) => ({
          ...prev,
          isFetchingMore: false,
          error: result.error,
        }));
      }
    } catch (err) {
      // Ignore abort errors - they're expected when switching branches
      if (err.name === 'AbortError') {
        return;
      }

      setServiceState((prev) => ({
        ...prev,
        isFetchingMore: false,
        error: "Failed to load more services.",
      }));
    }
  }, [serviceState.selectedBranch]);

  // Handle scroll for infinite loading
  const handleServiceScroll = useCallback(
    ({ clientHeight, scrollHeight, scrollTop }) => {
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;

      // Only load more if:
      // 1. User is near bottom
      // 2. Not currently fetching
      // 3. More pages available
      // 4. Not searching (only for "all services" view)
      if (
        isNearBottom &&
        !serviceState.isFetchingMore &&
        !serviceState.isFetchingAll &&
        serviceState.hasMore &&
        !serviceState.searchTerm
      ) {
        fetchNextPage(serviceState.currentPage + 1);
      }
    },
    [serviceState, fetchNextPage]
  );

  return {
    // State
    serviceState,
    serviceSearchInputRef,

    // Actions
    handleBranchChange,
    handleSearchChange,
    resetServiceSearch,
    handleServiceScroll,
  };
};