import { legacyApi } from './api/legacyApi';
import { akhilApi } from './api/akhilApi';
import { normalizeResponse } from './api/apiFactory';

/**
 * ============================================================
 * AKHIL API - TEMPORARILY DISABLED
 * ============================================================
 *
 * ISSUE: AKHIL API backend experiencing production errors
 * DATE: 2026-01-03
 * STATUS: Using Legacy API for ALL branches temporarily
 *
 * TO RESTORE AKHIL API WHEN BACKEND IS FIXED:
 * 1. Uncomment the AKHIL_API_BRANCHES array below
 * 2. Delete or comment out the empty array line
 * 3. Delete the AKHIL_TO_LEGACY_ID_MAP object (~20 lines)
 * 4. Delete the mapToLegacyBranchId function (~20 lines)
 * 5. Remove ID mapping call in Legacy API block (line ~246)
 * 6. Test with one branch first (e.g., Dhanmondi)
 * 7. Monitor for 24 hours before full rollout
 * 8. Update this comment block with restoration date
 *
 * ORIGINAL IMPLEMENTATION: commit 1a4635d2
 * ============================================================
 */

/*
// AKHIL API BRANCHES - Restore when backend is fixed
const AKHIL_API_BRANCHES = [
  'Dhanmondi',
  'English Road',
  'Shantinagar',
  'Mirpur',
  'Badda',
  'Jatrabari',
  'Savar',
  'Gazipur',
  'Narayangonj',
  'Rajshahi',
  'Noakhali',
  'Chattogram',
  'Mymensingh',
  'Khulna',
  'Kushtia',
  'Barishal',
];
*/

// TEMPORARY: Empty array forces Legacy API for all branches
const AKHIL_API_BRANCHES = [];

/**
 * ============================================================
 * ID MAPPING: AKHIL FACILITY ID → LEGACY BRANCH ID
 * ============================================================
 *
 * The braID values in branches.js were changed to match AKHIL's
 * facility IDs. When using Legacy API, we must map back to the
 * original Legacy branch IDs.
 *
 * DELETE THIS MAPPING when AKHIL API is restored.
 * ============================================================
 */
const AKHIL_TO_LEGACY_ID_MAP = {
  // AKHIL ID: Legacy ID
  2: 1,    // Dhanmondi
  12: 2,   // English Road
  9: 3,    // Shantinagar (Note: Shyamoli also uses 9, handled by branch name)
  13: 10,  // Mirpur
  3: 18,   // Badda
  19: 37,  // Jatrabari (Note: Dinajpur also uses 19, handled by branch name)
  16: 6,   // Savar
  8: 27,   // Gazipur
  11: 5,   // Narayangonj
  18: 42,  // Rajshahi
  5: 29,   // Noakhali
  15: 16,  // Chattogram (Note: Rangpur also uses 15, handled by branch name)
  10: 26,  // Mymensingh
  14: 36,  // Khulna
  4: 30,   // Kushtia
  6: 31,   // Barishal
};

/**
 * Maps AKHIL facility ID to Legacy branch ID for specific AKHIL branches
 * Non-AKHIL branches return their ID unchanged
 * @param {number} branchId - The current braID (AKHIL facility ID)
 * @param {string} branchName - The branch name for disambiguation
 * @returns {number} The correct branch ID for Legacy API
 */
const mapToLegacyBranchId = (branchId, branchName) => {
  // List of branches that WERE using AKHIL API (need ID mapping)
  const akhilBranchNames = [
    'Dhanmondi', 'English Road', 'Shantinagar', 'Mirpur',
    'Badda', 'Jatrabari', 'Savar', 'Gazipur', 'Narayangonj',
    'Rajshahi', 'Noakhali', 'Chattogram', 'Mymensingh',
    'Khulna', 'Kushtia', 'Barishal'
  ];

  // If this branch was using AKHIL, map its ID back to Legacy
  if (branchName && akhilBranchNames.includes(branchName)) {
    const legacyId = AKHIL_TO_LEGACY_ID_MAP[branchId];
    if (legacyId !== undefined) {
      console.log(`[ID Mapping] ${branchName}: AKHIL ID ${branchId} → Legacy ID ${legacyId}`);
      return legacyId;
    }
  }

  // Non-AKHIL branches: return ID unchanged
  return branchId;
};

/**
 * Determines which API to use based on branch name
 * @param {string|number} branchIdentifier - Branch name or ID
 * @param {object} branch - Branch object from reportDownload
 * @returns {object} API configuration
 */
const getApiForBranch = (branch) => {
  if (!branch) {
    return {
      api: legacyApi,
      apiType: 'LEGACY',
    };
  }

  // Check if branch name is in the Akhil API list
  const usesAkhilApi = AKHIL_API_BRANCHES.includes(branch.braName);

  return {
    api: usesAkhilApi ? akhilApi : legacyApi,
    apiType: usesAkhilApi ? 'AKHIL' : 'LEGACY',
    branch,
  };
};

/**
 * Normalizes service data from Akhil API format to legacy format
 * @param {array} services - Services from Akhil API
 * @returns {array} Normalized services
 */
const normalizeAkhilApiServices = (services) => {
  return services.map((service) => ({
    name: service.serviceName,
    price: parseFloat(service.serviceCharge),
    // Preserve original fields for potential future use
    _original: {
      serviceId: service.serviceId,
      subDeptId: service.subDeptId,
      subName: service.subName,
      facilityId: service.facilityId,
    },
  }));
};

/**
 * Fetches service charges using the appropriate API
 * @param {object} params - Request parameters
 * @param {number} params.branchId - Branch ID
 * @param {object} params.branch - Branch object from reportDownload
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.categoryId - Category ID (default: 0)
 * @param {string} params.searchTerm - Search term (optional)
 * @param {AbortSignal} params.signal - AbortSignal for cancelling requests (optional)
 * @returns {Promise<object>} Normalized response
 */
export const fetchServiceCharges = async ({
  branchId,
  branch = null,
  page = 1,
  categoryId = 0,
  searchTerm = null,
  signal = null,
}) => {
  try {
    const { api, apiType } = getApiForBranch(branch);

    if (apiType === 'AKHIL') {
      // Akhil API call - build payload
      const payload = {
        facilityId: String(branchId), // facilityId = braID
        pageNo: page,
      };

      // Only include serviceName if there's an actual search term
      // Empty string returns limited results, omitting it returns all services
      if (searchTerm) {
        payload.serviceName = searchTerm;
      }

      const response = await api.post('/api/VCP/GetServiceTariff', payload, {
        signal,
      });

      const { items, hasMore, count, errorCode, message, status } = response.data;

      // Special case: End of pagination (errorCode 400 with no items)
      // Akhil API returns errorCode 400 when reaching last page - this is NOT an error
      const isEndOfPagination =
        errorCode === 400 &&
        (!items || items.length === 0) &&
        (hasMore === false || hasMore === null || hasMore === 'false');

      if (isEndOfPagination) {
        // Successfully reached end of pagination - return empty result with success
        return normalizeResponse({
          success: true, // Not an error, just no more pages
          data: [],
          pagination: {
            currentPage: page,
            hasMore: false,
            total: 0,
            lastPage: null,
            itemsCount: 0,
          },
          apiType,
        });
      }

      // Check for actual API-level errors (excluding the "end of pagination" case above)
      if (errorCode !== 200 || status !== 'sucess') {
        return normalizeResponse({
          success: false,
          error: message || 'Failed to fetch services from new API',
          errorCode,
        });
      }

      // Normalize services to match legacy format
      const normalizedServices = normalizeAkhilApiServices(items || []);

      return normalizeResponse({
        success: true,
        data: normalizedServices,
        pagination: {
          currentPage: page,
          hasMore: hasMore === 'true' || hasMore === true,
          total: parseInt(count) || 0,
          // Akhil API: count field represents total number of pages
          lastPage: parseInt(count) || null,
          itemsCount: normalizedServices.length, // Track items per page
        },
        apiType,
      });
    } else {
      // Legacy API call
      // TEMPORARY: Map AKHIL facility IDs back to Legacy branch IDs
      const legacyBranchId = mapToLegacyBranchId(branchId, branch?.braName);

      const params = {
        branch_id: legacyBranchId,  // Use mapped ID for correct Legacy API calls
        test_service_category_id: categoryId,
        page,
      };

      // Add search parameters if search term exists
      if (searchTerm) {
        params.name = searchTerm;
        params.fast_search = 'yes';
      }

      const response = await api.get('/api/test-service-charges', {
        params,
        signal,
      });

      const data = response.data?.data?.data || [];
      const currentPage = response.data?.data?.current_page || page;
      const lastPage = response.data?.data?.last_page || 1;
      const total = response.data?.data?.total || 0;

      return normalizeResponse({
        success: true,
        data,
        pagination: {
          currentPage,
          lastPage,
          total,
          hasMore: currentPage < lastPage,
        },
        apiType,
      });
    }
  } catch (error) {
    // If request was aborted, throw the error to be handled by caller
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
      throw error;
    }

    console.error('Service fetch error:', error);

    return normalizeResponse({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch services',
      errorCode: error.response?.status,
    });
  }
};

/**
 * Fetches all pages of service charges
 * @param {object} params - Request parameters
 * @param {number} params.branchId - Branch ID
 * @param {object} params.branch - Branch object from reportDownload
 * @param {number} params.startPage - Starting page number
 * @param {number} params.endPage - Ending page number
 * @param {function} params.onPageFetched - Callback for each page fetched
 * @param {AbortSignal} params.signal - AbortSignal for cancelling requests (optional)
 * @returns {Promise<object>} Combined response with all services
 */
export const fetchAllServicePages = async ({
  branchId,
  branch = null,
  startPage = 2,
  endPage,
  onPageFetched = null,
  signal = null,
}) => {
  const allServices = [];
  let hasError = false;
  let errorMessage = null;

  for (let page = startPage; page <= endPage; page++) {
    try {
      const result = await fetchServiceCharges({
        branchId,
        branch,
        page,
        categoryId: 0,
        signal,
      });

      if (result.success) {
        allServices.push(...result.data);

        // Call callback with progress
        if (onPageFetched) {
          onPageFetched({
            page,
            totalPages: endPage,
            services: result.data,
            allServices,
          });
        }

        // No special break condition needed - loop stops at endPage naturally
      } else {
        hasError = true;
        errorMessage = result.error;
        break;
      }
    } catch (error) {
      // If request was aborted, throw the error immediately
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        throw error;
      }

      hasError = true;
      errorMessage = error.message;
      break;
    }
  }

  return normalizeResponse({
    success: !hasError,
    data: allServices,
    error: errorMessage,
    pagination: {
      totalFetched: allServices.length,
      lastPageFetched: Math.min(startPage + allServices.length - 1, endPage),
    },
  });
};
