import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

interface Medicine {
  medicition_id?: number;
  medicition_code: string;
  medicine_type: string;
  medicition_order?: number;
  medicine_time_period?: string;
  manufaturing_company?: string;
  supplier_id?: number;
  drug_name?: string;
  manufacture_date?: Date;
  expiry_date?: Date;
  batch_no?: string;
  quantity?: number;
  is_active: boolean;
  created_by?: string;
  update_at?: Date;
  updated_by?: string;
  label?: string; // For dropdown display
}

interface PharmacySupplier {
  pharmacy_supplier_id?: number;
  supplier_code?: string;
  supplier_name?: string;
  is_active: boolean;
  created_at?: Date;
  created_by?: string;
}

interface MedicineStockBreakdown {
  date: Date;
  batch_no: string;
  quantity_in: number;
  quantity_out: number;
  quantity_remaining: number;
  supplier_name?: string;
  transaction_type: string;
}

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TagModule,
    CardModule,
    CheckboxModule,
    TabViewModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.scss'
})
export class MedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  suppliers: PharmacySupplier[] = [];
  filteredMedicines: Medicine[] = [];
  filteredSuppliers: PharmacySupplier[] = [];
  medicineOptions: { label: string, value: string }[] = [];
  displayMedicineDialog: boolean = false;
  displaySupplierDialog: boolean = false;
  displayStockBreakdownDialog: boolean = false;
  isEditMode: boolean = false;
  searchText: string = '';
  selectedMedicine: Medicine | null = null;
  stockBreakdown: MedicineStockBreakdown[] = [];

  medicineForm: Medicine = {
    medicition_code: '',
    medicine_type: '',
    supplier_id: undefined,
    drug_name: '',
    manufacture_date: undefined,
    expiry_date: undefined,
    batch_no: '',
    quantity: undefined,
    is_active: true
  };

  supplierForm: PharmacySupplier = {
    supplier_code: '',
    supplier_name: '',
    is_active: true
  };

  ngOnInit() {
    this.loadMedicines();
    this.loadSuppliers();
  }

  loadMedicines() {
    this.medicines = [
      {
        medicition_id: 1,
        medicition_code: 'MED001',
        medicine_type: 'Tablet',
        medicine_time_period: 'After meals',
        manufaturing_company: 'ABC Pharma',
        is_active: true,
        created_by: 'Admin',
        label: 'MED001 - Tablet'
      },
      {
        medicition_id: 2,
        medicition_code: 'MED002',
        medicine_type: 'Syrup',
        medicine_time_period: 'Before meals',
        manufaturing_company: 'XYZ Pharma',
        is_active: true,
        created_by: 'Admin',
        label: 'MED002 - Syrup'
      }
    ];
    // Ensure all medicines have labels
    this.medicines.forEach(m => {
      if (!m.label) {
        m.label = `${m.medicition_code} - ${m.medicine_type}`;
      }
    });
    this.filteredMedicines = [...this.medicines];
    this.medicineOptions = this.medicines.map(m => ({
      label: `${m.medicition_code} - ${m.medicine_type}`,
      value: m.medicition_code
    }));
  }

  loadSuppliers() {
    this.suppliers = [
      {
        pharmacy_supplier_id: 1,
        supplier_code: 'SUP001',
        supplier_name: 'MedSupply Co.',
        is_active: true,
        created_by: 'Admin'
      }
    ];
    this.filteredSuppliers = [...this.suppliers];
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredMedicines = [...this.medicines];
      return;
    }
    this.filteredMedicines = this.medicines.filter(med =>
      med.medicition_code.toLowerCase().includes(this.searchText.toLowerCase()) ||
      med.medicine_type.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openNewMedicine() {
    this.medicineForm = {
      medicition_code: '',
      medicine_type: '',
      supplier_id: undefined,
      drug_name: '',
      manufacture_date: undefined,
      expiry_date: undefined,
      batch_no: '',
      quantity: undefined,
      is_active: true
    };
    this.isEditMode = false;
    this.displayMedicineDialog = true;
  }

  editMedicine(medicine: Medicine) {
    this.medicineForm = { ...medicine };
    this.isEditMode = true;
    this.displayMedicineDialog = true;
  }

  saveMedicine() {
    if (this.isEditMode && this.medicineForm.medicition_id) {
      const index = this.medicines.findIndex(m => m.medicition_id === this.medicineForm.medicition_id);
      if (index !== -1) {
        const updatedMedicine = { 
          ...this.medicineForm, 
          update_at: new Date(),
          label: `${this.medicineForm.medicition_code} - ${this.medicineForm.medicine_type}`
        };
        this.medicines[index] = updatedMedicine;
      }
    } else {
      const newId = Math.max(...this.medicines.map(m => m.medicition_id || 0)) + 1;
      const newMedicine = {
        ...this.medicineForm,
        medicition_id: newId,
        created_by: 'Current User',
        update_at: new Date(),
        label: `${this.medicineForm.medicition_code} - ${this.medicineForm.medicine_type}`
      };
      this.medicines.push(newMedicine);
    }
    this.filteredMedicines = [...this.medicines];
    this.displayMedicineDialog = false;
  }

  openNewSupplier() {
    this.supplierForm = {
      supplier_code: '',
      supplier_name: '',
      is_active: true
    };
    this.isEditMode = false;
    this.displaySupplierDialog = true;
  }

  saveSupplier() {
    if (this.isEditMode && this.supplierForm.pharmacy_supplier_id) {
      const index = this.suppliers.findIndex(s => s.pharmacy_supplier_id === this.supplierForm.pharmacy_supplier_id);
      if (index !== -1) {
        this.suppliers[index] = { ...this.supplierForm };
      }
    } else {
      const newId = Math.max(...this.suppliers.map(s => s.pharmacy_supplier_id || 0)) + 1;
      this.suppliers.push({
        ...this.supplierForm,
        pharmacy_supplier_id: newId,
        created_by: 'Current User',
        created_at: new Date()
      });
    }
    this.filteredSuppliers = [...this.suppliers];
    this.displaySupplierDialog = false;
  }

  getSeverity(isActive: boolean) {
    return isActive ? 'success' : 'warning';
  }

  getSupplierName(supplierId?: number): string {
    if (!supplierId) return 'N/A';
    const supplier = this.suppliers.find(s => s.pharmacy_supplier_id === supplierId);
    return supplier?.supplier_name || 'N/A';
  }

  getMedicineLabel(medicine: Medicine): string {
    return `${medicine.medicition_code} - ${medicine.medicine_type}`;
  }

  formatDate(date?: Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  openStockBreakdown(medicine: Medicine) {
    this.selectedMedicine = medicine;
    this.loadStockBreakdown(medicine.medicition_id);
    this.displayStockBreakdownDialog = true;
  }

  loadStockBreakdown(medicineId?: number) {
    // Sample stock breakdown data - in real app, this would come from an API
    if (!medicineId) {
      this.stockBreakdown = [];
      return;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    this.stockBreakdown = [
      {
        date: today,
        batch_no: 'BATCH001',
        quantity_in: 100,
        quantity_out: 25,
        quantity_remaining: 75,
        supplier_name: 'MedSupply Co.',
        transaction_type: 'Purchase'
      },
      {
        date: yesterday,
        batch_no: 'BATCH002',
        quantity_in: 50,
        quantity_out: 10,
        quantity_remaining: 40,
        supplier_name: 'MedSupply Co.',
        transaction_type: 'Purchase'
      },
      {
        date: twoDaysAgo,
        batch_no: 'BATCH001',
        quantity_in: 0,
        quantity_out: 30,
        quantity_remaining: 45,
        supplier_name: 'MedSupply Co.',
        transaction_type: 'Sale'
      },
      {
        date: threeDaysAgo,
        batch_no: 'BATCH003',
        quantity_in: 200,
        quantity_out: 0,
        quantity_remaining: 200,
        supplier_name: 'MedSupply Co.',
        transaction_type: 'Purchase'
      }
    ];
  }

}

