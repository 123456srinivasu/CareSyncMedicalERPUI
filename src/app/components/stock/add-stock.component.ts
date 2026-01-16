import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SuppliersService, PharmacySupplier, Medication, InvoiceRequest } from '../../core/services/suppliers.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CampsService } from '../../core/services/camps.service';

interface Medicine {
  medicition_id?: number;
  medicition_code: string;
  medicine_type: string;
  drug_name?: string;
  label?: string;
}

interface StockMedicineItem {
  medicine_id?: number;
  medicine?: Medicine;
  hsn_no?: string;
  batch_no?: string;
  exp_date?: Date;
  quantity?: number;
}

interface StockForm {
  supplier_id?: number;
  invoice_id?: string;
  invoice_date?: Date;
  invoice_amount?: number;
  payment_mode?: string;
  medicines: StockMedicineItem[];
}

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.scss'
})
export class AddStockComponent implements OnInit {
  private readonly suppliersService = inject(SuppliersService);
  private readonly router = inject(Router);
  private readonly campsService = inject(CampsService);
  suppliers: PharmacySupplier[] = [];
  medicines: Medicine[] = [];
  medicineOptions: { label: string, value: number }[] = [];
  paymentModes: { label: string, value: string }[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  campOptions: { label: string; value: number }[] = [];
  selectedCampId?: number;
  stockForm: StockForm = {
    supplier_id: undefined,
    invoice_id: '',
    invoice_date: undefined,
    invoice_amount: undefined,
    payment_mode: undefined,
    medicines: []
  };


  ngOnInit() {
    this.selectedCampId = undefined;
    this.loadCamps();
    this.loadSuppliers();
    this.loadMedicines();
    this.loadPaymentModes();
  }

  loadCamps() {
    this.loading = true;
    this.campsService.getAllCamps({ status: 'All', page: 0, size: 1000, sort: 'desc' }).subscribe({
      next: (response: any) => {
        let apiCamps: any[] = [];
        if (Array.isArray(response?.content)) {
          apiCamps = response.content;
        } else if (Array.isArray(response)) {
          apiCamps = response;
        } else if (response && Array.isArray(response.data)) {
          apiCamps = response.data;
        }
        this.campOptions = apiCamps.map((camp: any) => ({
          label: camp.campName || camp.camp_code || `Camp ${camp.campId}`,
          value: camp.campId
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading camps:', error);
        this.errorMessage = 'Failed to load camps. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadPaymentModes() {
    this.paymentModes = [
      { label: 'Cash', value: 'Cash' },
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'Debit Card', value: 'Debit Card' },
      { label: 'Net Banking', value: 'Net Banking' },
      { label: 'UPI', value: 'UPI' },
      { label: 'Cheque', value: 'Cheque' },
      { label: 'Bank Transfer', value: 'Bank Transfer' },
      { label: 'Credit', value: 'Credit' },
      { label: 'Other', value: 'Other' }
    ];
  }

  loadSuppliers() {
    this.loading = true;
    this.errorMessage = '';
    
    this.suppliersService.getActivePharmacySuppliers()
      .pipe(
        catchError(error => {
          console.error('Error loading suppliers:', error);
          this.errorMessage = 'Failed to load suppliers. Please try again later.';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (suppliers: PharmacySupplier[]) => {
          this.suppliers = suppliers;
          this.loading = false;
          console.log('Suppliers loaded:', this.suppliers);
        },
        error: (error) => {
          console.error('Error in suppliers subscription:', error);
          this.loading = false;
        }
      });
  }

  loadMedicines() {
    // Medicines will be loaded based on selected supplier
    this.medicineOptions = [];
  }

  onCampChange() {
    // Reset any camp-related errors
    this.errorMessage = '';
  }

  clearSelection() {
    this.selectedCampId = undefined;
  }

  onSupplierChange() {
    this.stockForm.medicines=[];
    if (this.stockForm.supplier_id) {
      // Find the selected supplier
      const selectedSupplier = this.suppliers.find(s => s.pharmacySupplierId === this.stockForm.supplier_id);
      
      if (selectedSupplier && selectedSupplier.medications) {
        // Populate medicine options from the selected supplier's medications
        this.medicineOptions = selectedSupplier.medications
          .filter(m => m.isActive)
          .map(m => ({
            label: `${m.medicationCode} - ${m.medicationName} (${m.medicineType})`,
            value: m.medicationId
          }));
        
        // Clear existing medicine selections when supplier changes
        this.stockForm.medicines.forEach(med => {
          med.medicine_id = undefined;
        });
        
        console.log('Medicine options updated for supplier:', selectedSupplier.supplierName, this.medicineOptions);
      } else {
        this.medicineOptions = [];
      }
    } else {
      this.medicineOptions = [];
    }
  }

  addMedicine() {
    this.stockForm.medicines.push({
      medicine_id: undefined,
      hsn_no: '',
      batch_no: '',
      exp_date: undefined,
      quantity: undefined
    });
  }

  removeMedicine(index: number) {
    this.stockForm.medicines.splice(index, 1);
  }

  onMedicineChange(index: number, medicineId: number | null) {
    if (!medicineId) {
      // Medicine was cleared, reset the medicine object
      this.stockForm.medicines[index].medicine = undefined;
      return;
    }
    
    // Find the selected medicine from the current supplier's medications
    if (this.stockForm.supplier_id) {
      const selectedSupplier = this.suppliers.find(s => s.pharmacySupplierId === this.stockForm.supplier_id);
      if (selectedSupplier && selectedSupplier.medications) {
        const selectedMedication = selectedSupplier.medications.find(m => m.medicationId === medicineId);
        if (selectedMedication) {
          // Map Medication to Medicine format for compatibility
          this.stockForm.medicines[index].medicine = {
            medicition_id: selectedMedication.medicationId,
            medicition_code: selectedMedication.medicationCode,
            medicine_type: selectedMedication.medicineType,
            drug_name: selectedMedication.medicationName,
            label: `${selectedMedication.medicationCode} - ${selectedMedication.medicationName} (${selectedMedication.medicineType})`
          };
        }
      }
    }
  }

  getMedicineLabel(medicineId: number): string {
    // Find medicine from selected supplier's medications
    if (this.stockForm.supplier_id) {
      const selectedSupplier = this.suppliers.find(s => s.pharmacySupplierId === this.stockForm.supplier_id);
      if (selectedSupplier && selectedSupplier.medications) {
        const medication = selectedSupplier.medications.find(m => m.medicationId === medicineId);
        if (medication) {
          return `${medication.medicationCode} - ${medication.medicationName} (${medication.medicineType})`;
        }
      }
    }
    return '';
  }

  /**
   * Get filtered medicine options for a specific row
   * Excludes medicines that are already selected in other rows
   * @param currentRowIndex - The index of the current row
   * @returns Filtered medicine options array
   */
  getMedicineOptionsForRow(currentRowIndex: number): { label: string, value: number }[] {
    // Get all selected medicine IDs from other rows (excluding current row)
    const selectedMedicineIds = this.stockForm.medicines
      .map((med, index) => index !== currentRowIndex && med.medicine_id ? med.medicine_id : null)
      .filter(id => id !== null) as number[];
    
    // Filter out already selected medicines
    return this.medicineOptions.filter(option => 
      !selectedMedicineIds.includes(option.value)
    );
  }

  saveStock() {
    // Validate form
    if (!this.selectedCampId || !this.stockForm.supplier_id || !this.stockForm.invoice_id || !this.stockForm.invoice_date || 
        !this.stockForm.invoice_amount || !this.stockForm.payment_mode || this.stockForm.medicines.length === 0) {
      this.errorMessage = 'Please select a camp and fill in all required fields, then add at least one medicine.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Prepare invoice payload
    const invoicePayload: InvoiceRequest = {
      invoiceNumber: this.stockForm.invoice_id!,
      invoiceDate: this.stockForm.invoice_date!.toISOString(),
      amount: this.stockForm.invoice_amount!.toString(),
      paymentMode: this.stockForm.payment_mode!,
      pharmacySupplier: {
        pharmacySupplierId: this.stockForm.supplier_id!.toString()
      }
    };

    console.log('Invoice Payload:', invoicePayload);

    // First, create the invoice
    this.suppliersService.createInvoice(invoicePayload).subscribe({
      next: (invoiceResponse: any) => {
        console.log('Invoice created:', invoiceResponse);
        
        // Prepare medicine stock payload
        const stockPayload = this.stockForm.medicines.map(med => ({
          batchNumber: med.batch_no,
          hsnCode: med.hsn_no,
          manufacturingDate: new Date().toISOString(),
          expiryDate: med.exp_date ? med.exp_date.toISOString() : new Date().toISOString(),
          quantity: med.quantity,
          medication: {
            medicationId: med.medicine_id
          },
          invoice: {
            invoiceId: invoiceResponse.invoiceId.toString()
          },
          camp: {
            campId: this.selectedCampId!.toString()
          }
        }));
   

        console.log('Stock Payload:', stockPayload);

        // Then, create the medicine stock
        this.campsService.addCampMedicineStock(this.selectedCampId!, stockPayload).subscribe({
          next: (response: any) => {
            console.log('Stock saved:', response);
            this.loading = false;
            this.router.navigate(['/stock/current']);
          },
          error: (error: any) => {
            console.error('Error saving stock:', error);
            this.loading = false;
            this.errorMessage = 'Failed to save stock. Please try again later.';
          }
        });
      },
      error: (error: any) => {
        console.error('Error creating invoice:', error);
        this.loading = false;
        this.errorMessage = 'Failed to create invoice. Please try again later.';
      }
    });
  }
}

