import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getApiUrl, API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private readonly http = inject(HttpClient);
  /**
   * Get all states
   * @returns Observable of states array
   */
  getStates(): Observable<any[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.STATES.BASE);
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching states:', error);
        throw error;
      })
    );
  }

  /**
   * Get state by ID
   * @param id State ID
   * @returns Observable of state object
   */
  getStateById(id: number): Observable<any> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.STATES.BY_ID(id));
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching state with id ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get all districts
   * @returns Observable of districts array
   */
  getDistricts(): Observable<any[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.DISTRICTS.BASE);
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching districts:', error);
        throw error;
      })
    );
  }

  /**
   * Get districts by state ID
   * @param stateId State ID
   * @returns Observable of districts array
   */
  getDistrictsByState(stateId: number): Observable<any[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.DISTRICTS.BY_STATE(stateId));
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching districts for state ${stateId}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get all mandals
   * @returns Observable of mandals array
   */
  getMandals(): Observable<any[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.MANDALS.BASE);
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching mandals:', error);
        throw error;
      })
    );
  }

  /**
   * Get mandals by district ID
   * @param districtId District ID
   * @returns Observable of mandals array
   */
  getMandalsByDistrict(districtId: number): Observable<any[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.MANDALS.BY_DISTRICT(districtId));
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching mandals for district ${districtId}:`, error);
        throw error;
      })
    );
  }
}
