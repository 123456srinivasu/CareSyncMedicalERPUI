import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getApiUrl, API_CONFIG } from '../constants/api.constants';

/**
 * Medicine Stock interface matching API response
 */
export interface MedicineStock {
  medicineStockId: number;
  batchNumber: string;
  hsnCode: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

/**
 * Camp interface matching API response
 */
export interface Camp {
  campId: number;
  campName: string;
  campCode: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  updateAt: string;
  updatedBy: string;
  createdAt: string;
  campEstablishmentYear?: string;
  medicineStocks: MedicineStock[];
}

/**
 * Medicine Lookup New interface matching API response
 */
export interface MedicineLookupNew {
  medicationICode: string;
  medicationName: string;
  medicineType: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  medicineStocks?: MedicineStock[];
}

/**
 * Camp Medicine Stock Summary interface matching API response
 */
export interface CampMedicineStockSummary {
  campMedicineStockSummaryId: number;
  quantity: number;
  medicineLookupNew: MedicineLookupNew;
  medicineStocks: MedicineStock[];
}

/**
 * Service for managing camp-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class CampsService {
  private readonly http = inject(HttpClient);

  /**
   * Get all camps
   * @returns Observable of Camp array
   */
  getAllCamps(): Observable<any[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CAMPS.BASE);
    // Use responseType: 'text' to handle responses with circular references
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((responseText: string) => {
        try {
          // Parse JSON manually
          const parsed = JSON.parse(responseText);
          // Remove circular references by cleaning up campAddresses
          if (Array.isArray(parsed)) {
            return parsed.map((camp: any) => {
              if (camp.campAddresses && Array.isArray(camp.campAddresses)) {
                camp.campAddresses = camp.campAddresses.map((addr: any) => {
                  // Remove the nested camp object to break circular reference
                  const { camp, ...addressData } = addr;
                  return addressData;
                });
              }
              return camp;
            });
          }
          return parsed;
        } catch (parseError) {
          console.error('Error parsing response text:', parseError);
          throw new Error('Failed to parse response');
        }
      }),
      catchError(error => {
        console.error('Error fetching camps:', error);
        // If error has text property, try to parse it
        if (error.error && error.error.text) {
          try {
            const parsed = JSON.parse(error.error.text);
            // Clean circular references
            if (Array.isArray(parsed)) {
              const cleaned = parsed.map((camp: any) => {
                if (camp.campAddresses && Array.isArray(camp.campAddresses)) {
                  camp.campAddresses = camp.campAddresses.map((addr: any) => {
                    const { camp, ...addressData } = addr;
                    return addressData;
                  });
                }
                return camp;
              });
              return of(cleaned);
            }
            return of(parsed);
          } catch (parseError) {
            console.error('Error parsing error response text:', parseError);
          }
        }
        throw error;
      })
    );
  }

  /**
   * Get all active camps
   * @returns Observable of Camp array
   */
  getActiveCamps(): Observable<Camp[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CAMPS.ACTIVE);
    return this.http.get<Camp[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching active camps:', error);
        throw error;
      })
    );
  }

  /**
   * Get camp by ID
   * @param campId - Camp ID
   * @returns Observable of Camp
   */
  getCampById(campId: number): Observable<Camp> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CAMPS.BY_ID(campId));
    return this.http.get<Camp>(url).pipe(
      catchError(error => {
        console.error(`Error fetching camp ${campId}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get camp medicine stock summary by camp ID
   * @param campId - Camp ID
   * @returns Observable of CampMedicineStockSummary array
   */
  getCampMedicineStockSummary(campId: number): Observable<CampMedicineStockSummary[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CAMP_MEDICINE_STOCK_SUMMARY.BY_CAMP(campId));
    return this.http.get<CampMedicineStockSummary[]>(url).pipe(
      catchError(error => {
        console.error(`Error fetching camp medicine stock summary for camp ${campId}:`, error);
        throw error;
      })
    );
  }
  /**
   * Add camp medicine stock
   * @param campId - Camp ID (not used in endpoint but kept for compatibility)
   * @param payload - Payload array of medicine stock items
   * @returns Observable of any
   */
  addCampMedicineStock(campId: number, payload: any): Observable<any> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CAMP_MEDICINE_STOCK.ADD(campId));
    return this.http.post<any>(url, payload).pipe(
      catchError(error => {
        console.error('Error adding camp medicine stock:', error);
        throw error;
      })
    );
  }

  /**
   * Create a new camp
   * @param payload - Camp creation payload
   * @returns Observable of any
   */
  createCamp(payload: any): Observable<any> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.CAMPS.CREATE);
    return this.http.post<any>(url, payload).pipe(
      catchError(error => {
        console.error('Error creating camp:', error);
        throw error;
      })
    );
  } 
}

