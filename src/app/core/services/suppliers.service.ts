import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getApiUrl, API_CONFIG } from '../constants/api.constants';

/**
 * Medication interface matching API response
 */
export interface Medication {
  medicationId: number;
  medicationCode: string;
  medicationName: string;
  medicineType: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  medicineStocks?: any[];
}

/**
 * Invoice interface matching API response
 */
export interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  paymentMode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  medicineStocks?: any[];
}

/**
 * Invoice request payload interface
 */
export interface InvoiceRequest {
  invoiceNumber: string;
  invoiceDate: string;
  amount: string;
  paymentMode: string;
  pharmacySupplier: {
    pharmacySupplierId: string;
  };
}

/**
 * Pharmacy Supplier interface matching API response
 */
export interface PharmacySupplier {
  pharmacySupplierId: number;
  supplierCode: string;
  supplierName: string;
  contactName?: string;
  contactEmail?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updateAt: string;
  updatedBy: string;
  medications?: Medication[];
  invoices?: Invoice[];
}

/**
 * Service for managing supplier-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private readonly http = inject(HttpClient);

  /**
   * Get all active pharmacy suppliers
   * @returns Observable of PharmacySupplier array
   */
  getActivePharmacySuppliers(): Observable<PharmacySupplier[]> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.PHARMACY_SUPPLIER.ACTIVE);
    return this.http.get<PharmacySupplier[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching active pharmacy suppliers:', error);
        throw error;
      })
    );
  }

  /**
   * Create invoice
   * @param payload - Invoice request payload
   * @returns Observable of Invoice
   */
  createInvoice(payload: InvoiceRequest): Observable<Invoice> {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.INVOICE.CREATE);
    return this.http.post<Invoice>(url, payload).pipe(
      catchError(error => {
        console.error('Error creating invoice:', error);
        throw error;
      })
    );
  }
}

