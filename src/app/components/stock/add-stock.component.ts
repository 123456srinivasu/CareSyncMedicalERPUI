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
import { SuppliersService, PharmacySupplier, Medication } from '../../core/services/suppliers.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


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
  
  suppliers: PharmacySupplier[] = [];
  medicines: Medicine[] = [];
  medicineOptions: { label: string, value: number }[] = [];
  paymentModes: { label: string, value: string }[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  
  stockForm: StockForm = {
    supplier_id: undefined,
    invoice_id: '',
    invoice_date: undefined,
    invoice_amount: undefined,
    payment_mode: undefined,
    medicines: []
  };

  ngOnInit() {
    this.loadSuppliers();
    this.loadMedicines();
    this.loadPaymentModes();
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

  onSupplierChange() {
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

  onMedicineChange(index: number, medicineId: number) {
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

  saveStock() {
    console.log('Stock Form:', this.stockForm);
    // Implement save logic here
  }
}

