import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getApiUrl, API_CONFIG } from '../constants/api.constants';

/**
 * Patient interface
 */
export interface Patient {
    patientId?: number;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private readonly http = inject(HttpClient);

    /**
     * Get all patients
     * @returns Observable of Patient array
     */
    getPatients(): Observable<any[]> {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PATIENTS.BASE);
        return this.http.get<any[]>(url).pipe(
            catchError(error => {
                console.error('Error fetching patients:', error);
                throw error;
            })
        );
    }

    /**
     * Get patient by ID
     * @param id - Patient ID
     * @returns Observable of Patient
     */
    getPatientById(id: number): Observable<Patient> {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PATIENTS.BY_ID(id));
        return this.http.get<Patient>(url).pipe(
            catchError(error => {
                console.error(`Error fetching patient ${id}:`, error);
                throw error;
            })
        );
    }

    /**
     * Create a new patient
     * @param payload - Patient creation payload
     * @returns Observable of any
     */
    createPatient(payload: any): Observable<any> {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PATIENTS.CREATE);
        return this.http.post<any>(url, payload).pipe(
            catchError(error => {
                console.error('Error creating patient:', error);
                throw error;
            })
        );
    }

    /**
     * Update a patient
     * @param id - Patient ID
     * @param payload - Patient update payload
     * @returns Observable of any
     */
    updatePatient(id: number, payload: any): Observable<any> {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PATIENTS.UPDATE(id));
        return this.http.put<any>(url, payload).pipe(
            catchError(error => {
                console.error(`Error updating patient ${id}:`, error);
                throw error;
            })
        );
    }

    /**
     * Delete a patient
     * @param id - Patient ID
     * @returns Observable of any
     */
    deletePatient(id: number): Observable<any> {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PATIENTS.DELETE(id));
        return this.http.delete<any>(url).pipe(
            catchError(error => {
                console.error(`Error deleting patient ${id}:`, error);
                throw error;
            })
        );
    }

    /**
     * Search patients by name
     * @param name - Name to search
     * @returns Observable of Patient array
     */
    searchPatients(name: string): Observable<any[]> {
        const url = getApiUrl(API_CONFIG.ENDPOINTS.PATIENTS.SEARCH(name));
        return this.http.get<any[]>(url).pipe(
            catchError(error => {
                console.error(`Error searching patients with name ${name}:`, error);
                throw error;
            })
        );
    }
}

