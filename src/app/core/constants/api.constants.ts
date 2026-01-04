/**
 * API Configuration Constants
 * Centralized configuration for API endpoints, base URLs, and environment settings
 */

export const API_CONFIG = {
  // Base API Configuration
  BASE_URL: 'http://localhost:8080',
  API_PREFIX: '/api',
  
  // API Endpoints
  ENDPOINTS: {
    CAMPS: {
      BASE: '/camps',
      ACTIVE: '/camps/active',
      BY_ID: (id: number) => `/camps/${id}`,
      CREATE: '/camps',
      UPDATE: (id: number) => `/camps/${id}`,
      DELETE: (id: number) => `/camps/${id}`
    },
    STOCK: {
      BASE: '/stock',
      CURRENT: '/stock/current',
      ADD: '/stock',
      BY_CAMP: (campId: number) => `/stock/camp/${campId}`
    },
    MEDICINES: {
      BASE: '/medicines',
      ACTIVE: '/medicines/active'
    },
    SUPPLIERS: {
      BASE: '/suppliers',
      ACTIVE: '/suppliers/active'
    }
  }
} as const;

/**
 * Helper function to build full API URL
 * @param endpoint - API endpoint path
 * @returns Complete API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
}


