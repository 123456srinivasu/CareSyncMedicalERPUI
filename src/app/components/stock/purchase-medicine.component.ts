import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CampsService } from '../../core/services/camps.service';
import { SuppliersService, PharmacySupplier } from '../../core/services/suppliers.service';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-purchase-medicine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    TableModule,
    InputNumberModule,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './purchase-medicine.component.html',
  styleUrl: './purchase-medicine.component.scss'
})
export class PurchaseMedicineComponent implements OnInit {
  private readonly campsService = inject(CampsService);
  private readonly suppliersService = inject(SuppliersService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  campOptions: { label: string; value: number }[] = [];
  selectedCampId?: number;
  loading = false;
  errorMessage = '';
  successMessage = '';
  orderComments: string = '';
  suppliers: PharmacySupplier[] = [];
  orderItems: { supplierId?: number; medicineId?: number; quantity?: number }[] = [];
  supplierOptions: { label: string; value: number }[] = [];

  ngOnInit(): void {
    this.loadCamps();
    this.loadSuppliers();
  }

  loadCamps(): void {
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

  loadSuppliers(): void {
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
          this.suppliers = suppliers || [];
          this.supplierOptions = this.suppliers.map(s => ({
            label: s.supplierName,
            value: s.pharmacySupplierId
          }));
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading suppliers:', error);
          this.loading = false;
        }
      });
  }

  onCampChange(): void {
    this.errorMessage = '';
  }

  clearSelection(): void {
    this.selectedCampId = undefined;
  }

  addMedicineRow(): void {
    // Clear any prior "no medicines" error once user adds a row
    this.errorMessage = '';
    this.successMessage = '';
    this.orderItems.push({
      supplierId: undefined,
      medicineId: undefined,
      quantity: 1
    });
  }

  removeMedicineRow(index: number): void {
    this.orderItems.splice(index, 1);
  }

  onSupplierChange(rowIndex: number): void {
    // Reset medicine when supplier changes
    if (this.orderItems[rowIndex]) {
      this.orderItems[rowIndex].medicineId = undefined;
    }
    // Clear supplier-related errors once a supplier is chosen
    this.errorMessage = '';
    this.successMessage = '';
  }

  onMedicineSelect(): void {
    // Clear medicine-related errors once a medicine is chosen
    this.errorMessage = '';
    this.successMessage = '';
  }

  getMedicineOptionsForRow(rowIndex: number): { label: string; value: number }[] {
    const row = this.orderItems[rowIndex];
    if (!row?.supplierId) return [];

    const supplier = this.suppliers.find(s => s.pharmacySupplierId === row.supplierId);
    if (!supplier || !supplier.medications) return [];

    // exclude already selected medicines in other rows
    const selectedIds = new Set(
      this.orderItems
        .map((r, i) => (i !== rowIndex ? r.medicineId : undefined))
        .filter((id): id is number => !!id)
    );

    return supplier.medications
      .filter(m => m.isActive && !selectedIds.has(m.medicationId))
      .map(m => ({
        label: `${m.medicationCode} - ${m.medicationName} (${m.medicineType})`,
        value: m.medicationId
      }));
  }

  createOrder(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedCampId) {
      this.errorMessage = 'Please select a camp.';
      return;
    }
    if (this.orderItems.length === 0) {
      this.errorMessage = 'Please add at least one medicine.';
      return;
    }

    // Validate each row
    for (const [index, row] of this.orderItems.entries()) {
      if (!row.supplierId) {
        this.errorMessage = `Please select supplier for row ${index + 1}.`;
        return;
      }
      if (!row.medicineId) {
        this.errorMessage = `Please select medicine for row ${index + 1}.`;
        return;
      }
      if (!row.quantity || row.quantity <= 0) {
        this.errorMessage = `Please enter quantity for row ${index + 1}.`;
        return;
      }
    }

    // Build payload grouped by supplier with medicines array
    const supplierOrdersMap = new Map<number, { supplierId: number; medicines: { medicationId: number; requestedQuantity: number }[] }>();
    this.orderItems.forEach(row => {
      if (!row.supplierId || !row.medicineId || !row.quantity) {
        return;
      }
      if (!supplierOrdersMap.has(row.supplierId)) {
        supplierOrdersMap.set(row.supplierId, {
          supplierId: row.supplierId,
          medicines: []
        });
      }
      supplierOrdersMap.get(row.supplierId)!.medicines.push({
        medicationId: row.medicineId,
        requestedQuantity: row.quantity
      });
    });

    const payload = {
      campId: this.selectedCampId,
      requestedBy: 'user',
      remarks: this.orderComments || '',
      supplierOrders: Array.from(supplierOrdersMap.values())
    };
    
    this.loading = true;
    this.campsService.createCampPurchaseOrder(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = response?.message || 'Order created successfully.';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.successMessage
          });
          // Clear form
          this.orderItems = [];
          this.orderComments = '';
        },
        error: (error: any) => {
          console.error('Error creating order:', error);
          const detail = error?.error?.message
            || (error?.error?.errors && Array.isArray(error.error.errors) ? error.error.errors.map((e: any) => `${e.field || 'Error'}: ${e.message || e}`).join(', ') : null)
            || 'Failed to create order. Please try again.';
          this.errorMessage = detail;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail
          });
        }
      });
  }

  goToReport(): void {
    this.router.navigate(['/stock/purchase-medicine-orders-report']);
  }
}
