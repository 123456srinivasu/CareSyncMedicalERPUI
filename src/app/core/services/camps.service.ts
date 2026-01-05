import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  medicationId: number;
  medicationCode: string;
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
}

