import { Component, OnInit } from '@angular/core';
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

interface PharmacySupplier {
  pharmacy_supplier_id?: number;
  supplier_code?: string;
  supplier_name?: string;
  is_active: boolean;
}

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
  suppliers: PharmacySupplier[] = [];
  medicines: Medicine[] = [];
  medicineOptions: { label: string, value: number }[] = [];
  paymentModes: { label: string, value: string }[] = [];
  
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
    this.suppliers = [
      { pharmacy_supplier_id: 1, supplier_code: 'SUP001', supplier_name: 'ABC Pharmaceuticals', is_active: true },
      { pharmacy_supplier_id: 2, supplier_code: 'SUP002', supplier_name: 'XYZ Medical Supplies', is_active: true },
      { pharmacy_supplier_id: 3, supplier_code: 'SUP003', supplier_name: 'MediCorp Distributors', is_active: true }
    ];
  }

  loadMedicines() {
    this.medicines = [
      { medicition_id: 1, medicition_code: 'MED001', medicine_type: 'Tablet', drug_name: 'Paracetamol', label: 'MED001 - Paracetamol (Tablet)' },
      { medicition_id: 2, medicition_code: 'MED002', medicine_type: 'Syrup', drug_name: 'Cough Syrup', label: 'MED002 - Cough Syrup (Syrup)' },
      { medicition_id: 3, medicition_code: 'MED003', medicine_type: 'Capsule', drug_name: 'Amoxicillin', label: 'MED003 - Amoxicillin (Capsule)' },
      { medicition_id: 4, medicition_code: 'MED004', medicine_type: 'Tablet', drug_name: 'Ibuprofen', label: 'MED004 - Ibuprofen (Tablet)' }
    ];
    
    this.medicineOptions = this.medicines
      .filter(m => m.medicition_id !== undefined)
      .map(m => ({
        label: m.label || `${m.medicition_code} - ${m.drug_name}`,
        value: m.medicition_id!
      }));
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
    const selectedMedicine = this.medicines.find(m => m.medicition_id === medicineId);
    if (selectedMedicine) {
      this.stockForm.medicines[index].medicine = selectedMedicine;
    }
  }

  getMedicineLabel(medicineId: number): string {
    const medicine = this.medicines.find(m => m.medicition_id === medicineId);
    return medicine ? (medicine.label || `${medicine.medicition_code} - ${medicine.drug_name}`) : '';
  }

  saveStock() {
    console.log('Stock Form:', this.stockForm);
    // Implement save logic here
  }
}

