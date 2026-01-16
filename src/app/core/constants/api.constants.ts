/**
 * API Configuration Constants
 * Centralized configuration for API endpoints, base URLs, and environment settings
 */

export const API_CONFIG = {
  // Base API Configuration
  BASE_URL: 'http://65.20.80.83:8081',
  //BASE_URL: 'http://localhost:8081',
  API_PREFIX: '/api',

  // API Endpoints
  ENDPOINTS: {
    CAMPS: {
      BASE: '/camps',
      ACTIVE: '/camps',
      BY_ID: (id: number) => `/camps/${id}`,
      CREATE: '/camps',
      UPDATE: (id: number) => `/camps/${id}`,
      DELETE: (id: number) => `/camps/${id}`,
    },
    STOCK: {
      BASE: '/stock',
      CURRENT: '/stock/current',
      ADD: '/stock',
      BY_CAMP: (campId: number) => `/stock/camp/${campId}`,
    },
    CAMP_MEDICINE_STOCK_SUMMARY: {
      BY_CAMP: (campId: number) => `/camp-medicine-stock-summary/camp/${campId}`,
    },
    CAMP_MEDICINE_STOCK: {
      ADD: (campId: number) => `/medicine-stock/batch`,
    },
    CAMP_RUNS: {
      PLANNING: (campId: number) => `/camp-runs/planning?campId=${campId}`,
      SAVE_PLANNING: '/camp-runs/camp-runs/planning',
      START: (campId: number, campRunId: number) => `/camp-runs/${campId}/${campRunId}/start`,
      STOP: (campId: number, campRunId: number) => `/camp-runs/${campId}/${campRunId}/stop`
    },
    MEDICINES: {
      BASE: '/medicines',
      ACTIVE: '/medicines/active',
    },
    SUPPLIERS: {
      BASE: '/suppliers',
      ACTIVE: '/suppliers/active',
    },
    PHARMACY_SUPPLIER: {
      BASE: '/pharmacy-supplier',
      ACTIVE: '/pharmacy-supplier/active',
    },
    INVOICE: {
      BASE: '/invoice',
      CREATE: '/invoice',
    },
    STATES: {
      BASE: '/states',
      BY_ID: (id: number) => `/states/${id}`
    },
    DISTRICTS: {
      BASE: '/districts',
      BY_STATE: (stateLookupId: number) => `/districts/by-state/${stateLookupId}`
    },
    MANDALS: {
      BASE: '/mandals',
      BY_DISTRICT: (districtLookupId: number) => `/mandals/by-district/${districtLookupId}`
    },
    USERS: {
      BY_ROLE: (role: string) => `/users/role/${role}`
    },
    

    PATIENTS: {
      BASE: '/patient-registration',
      CREATE: '/patient-registration',
      BY_ID: (id: number) => `/patient-registration/${id}`,
      UPDATE: (id: number) => `/patient-registration/${id}`,
      DELETE: (id: number) => `/patient-registration/${id}`,
      SEARCH: (name: string) => `/patient-registration/search?name=${name}`,
      SEARCH_BY_MOBILE: (mobileNumber: string) => `/patient-registration/search/by-mobile?mobileNumber=${mobileNumber}`,
      SEARCH_BY_NAME: (name: string) => `/patient-registration/search/by-name?name=${name}`,
      SEARCH_BY_FIELDS: (mrNumber: string) => `/patient-registration/search/by-fields?mrNumber=${mrNumber}`
    },
  },
} as const;

/**
 * Helper function to build full API URL
 * @param endpoint - API endpoint path
 * @returns Complete API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
}
