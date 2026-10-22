import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Advanced search optimization hook with debouncing, caching, and performance features
 */
export const useSearchOptimization = ({
  searchFunction,
  debounceMs = 300,
  cacheEnabled = true,
  cacheExpiryMs = 5 * 60 * 1000, // 5 minutes
  minSearchLength = 2,
} = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchHistoryRef = useRef([]);
  
  // Cache and refs
  const searchCache = useRef(new Map());
  const debounceTimer = useRef(null);
  const abortController = useRef(null);
  const lastSearchTime = useRef(0);

  // Load search history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pdcl-search-history');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSearchHistory(parsed.slice(0, 10)); // Keep only last 10 searches
        }
      } catch (error) {
        // Failed to load search history - continue silently
      }
    }
  }, []);

  // Debounce search term updates
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, debounceMs]);

  // Cache management
  const getCacheKey = useCallback((term, filters = {}) => {
    return `${term}_${JSON.stringify(filters)}`;
  }, []);

  const getCachedResult = useCallback((cacheKey) => {
    if (!cacheEnabled) return null;
    
    const cached = searchCache.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheExpiryMs) {
      return cached.data;
    }
    
    // Remove expired cache entry
    if (cached) {
      searchCache.current.delete(cacheKey);
    }
    
    return null;
  }, [cacheEnabled, cacheExpiryMs]);

  const setCachedResult = useCallback((cacheKey, data) => {
    if (!cacheEnabled) return;
    
    searchCache.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    // Limit cache size (keep last 50 entries)
    if (searchCache.current.size > 50) {
      const firstKey = searchCache.current.keys().next().value;
      searchCache.current.delete(firstKey);
    }
  }, [cacheEnabled]);

  // Update ref when searchHistory changes
  useEffect(() => {
    searchHistoryRef.current = searchHistory;
  }, [searchHistory]);

  // Save search to history
  const saveToHistory = useCallback((term) => {
    if (!term || term.length < minSearchLength) return;

    const newHistory = [
      term,
      ...searchHistoryRef.current.filter(item => item !== term)
    ].slice(0, 10);

    setSearchHistory(newHistory);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pdcl-search-history', JSON.stringify(newHistory));
      } catch (error) {
        // Failed to save search history - continue silently
      }
    }
  }, [minSearchLength]);

  // Perform optimized search
  const performSearch = useCallback(async (term, filters = {}) => {
    // Don't search if term is too short
    if (!term || term.length < minSearchLength) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const cacheKey = getCacheKey(term, filters);
    
    // Check cache first
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      setSearchResults(cachedResult);
      setIsSearching(false);
      return;
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }

    // Create new abort controller
    abortController.current = new AbortController();
    
    setIsSearching(true);
    setSearchError(null);
    lastSearchTime.current = Date.now();

    try {
      const results = await searchFunction(term, filters, {
        signal: abortController.current.signal,
      });

      // Only update if this is the most recent search
      if (Date.now() - lastSearchTime.current < 100 || 
          debouncedSearchTerm === term) {
        setSearchResults(results || []);
        setCachedResult(cacheKey, results || []);
        saveToHistory(term);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setSearchError(error.message || 'Search failed');
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, [
    minSearchLength,
    getCacheKey,
    getCachedResult,
    setCachedResult,
    saveToHistory,
    searchFunction,
  ]);

  // Execute search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm && searchFunction) {
      performSearch(debouncedSearchTerm);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, performSearch, searchFunction]);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pdcl-search-history');
      } catch (error) {
        // Failed to clear search history - continue silently
      }
    }
  }, []);

  // Clear search and results
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    searchCache.current.clear();
  }, []);

  // Get search suggestions based on history
  const getSearchSuggestions = useCallback((currentTerm) => {
    if (!currentTerm || currentTerm.length < 1) return searchHistoryRef.current.slice(0, 5);
    
    return searchHistoryRef.current
      .filter(item => 
        item.toLowerCase().includes(currentTerm.toLowerCase()) &&
        item !== currentTerm
      )
      .slice(0, 5);
  }, []);

  return {
    // State
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    searchResults,
    searchError,
    searchHistory,
    
    // Actions
    setSearchTerm,
    clearSearch,
    clearSearchHistory,
    clearCache,
    performSearch,
    getSearchSuggestions,
    
    // Cache info (for debugging)
    cacheSize: searchCache.current.size,
  };
};

/**
 * Specialized hook for doctor search with optimizations
 */
export const useDoctorSearchOptimization = (searchFunction) => {
  return useSearchOptimization({
    searchFunction,
    debounceMs: 300,
    minSearchLength: 2,
    cacheEnabled: true,
  });
};

/**
 * Specialized hook for service search with optimizations
 */
export const useServiceSearchOptimization = (searchFunction) => {
  return useSearchOptimization({
    searchFunction,
    debounceMs: 250,
    minSearchLength: 3,
    cacheEnabled: true,
  });
};