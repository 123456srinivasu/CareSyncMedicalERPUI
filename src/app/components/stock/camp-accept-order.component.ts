import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { CampsService } from '../../core/services/camps.service';

type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
type OrderStatusFilter = 'ALL' | OrderStatus;

interface CampOrderItem {
  purchaseOrderId: number;
  campId: number;
  campName: string;
  orderedDate: string;
  status: OrderStatus;
  comments: string;
  supplierName?: string;
}

interface CampOrderLine {
  id?: number;  
  medicineName: string;
  orderedQuantity: number;
  acceptedQuantity?: number;
  unitPrice: number;
  totalPrice: number;
  remarks?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-camp-accept-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    DialogModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './camp-accept-order.component.html',
  styleUrl: './camp-accept-order.component.scss'
})
export class CampAcceptOrderComponent implements OnInit {

  private readonly campsService = inject(CampsService);
  private readonly messageService = inject(MessageService);

  loading = false;
  errorMessage = '';
  selectedCampId?: number;
  selectedStatus: OrderStatusFilter = 'ALL';
  // TODO: Replace with selected supplier when supplier context is available
  supplierIdForFetch: number = 123;

  campOptions: { label: string; value: number }[] = [];
  statusOptions: { label: string; value: OrderStatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Rejected', value: 'REJECTED' }
  ];  
  orders: CampOrderItem[] = [];
  filteredOrders: CampOrderItem[] = [];
  displayOrderDialog = false;
  selectedOrder: CampOrderItem | null = null;
  orderLines: CampOrderLine[] = [];

  ngOnInit(): void {
    this.loadCamps();
    this.loadOrders();
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

        this.campOptions = apiCamps
          .filter(camp => camp?.campId !== undefined)
          .map(camp => ({
            label: camp.campCode ? `${camp.campCode} - ${camp.campName}` : camp.campName || `Camp ${camp.campId}`,
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

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    const params: any = {};
    if (this.selectedCampId) {
      params.campId = this.selectedCampId;
    }
    if (this.selectedStatus && this.selectedStatus !== 'ALL') {
      params.status = this.selectedStatus;
    }

    this.campsService.getCampPurchaseOrdersBySupplier(this.supplierIdForFetch, params)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response: any) => {
          const asArray = Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.content)
                ? response.content
                : response
                  ? [response]
                  : [];

          const mapToOrder = (po: any): CampOrderItem => ({
            purchaseOrderId: po.purchaseOrderId ?? po.id ?? 0,
            campId: po.campId ?? 0,
            campName: po.campName ?? '',
            orderedDate: po.requestedAt ?? '',
            status: (po.orderStatus ?? po.status ?? 'PENDING') as OrderStatus,
            comments: po.remarks ?? '',
            supplierName: po.supplierName ?? ''
          });

          this.orders = asArray.map(mapToOrder);
          this.applyFilter();
        },
        error: (error: any) => {
          console.error('Error loading purchase orders:', error);
          this.errorMessage = error?.error?.message || 'Failed to load purchase orders.';          
          const res=[
            {
              "purchaseOrderId": 1001,
              "campId": 456,
              "campName": "Health Camp - Downtown",
              "pharmacySupplierId": 123,
              "supplierName": "MediSupply Corp",
              "orderStatus": "PENDING",
              "requestedAt": "2026-01-15T10:30:00.000+00:00",
              "reviewedAt": "2026-01-16T14:45:00.000+00:00",
              "remarks": "Urgent order for upcoming camp",
              
            },
            {
              "purchaseOrderId": 1002,
              "campId": 456,
              "campName": "Health Camp - Downtown",
              "pharmacySupplierId": 123,
              "supplierName": "MediSupply Corp",
              "orderStatus": "PENDING",
              "requestedAt": "2026-01-17T09:15:00.000+00:00",
              "reviewedAt": "2026-01-18T11:20:00.000+00:00",
              "remarks": "Additional supplies needed",
              
            }
          ];
          const mapToOrder = (po: any): CampOrderItem => ({
            purchaseOrderId: po.purchaseOrderId ?? 0,
            campId: po.campId ?? 0,
            campName: po.campName ?? '',
            orderedDate: po.requestedAt ?? '',
            comments: po.remarks ?? '',
            status: (po.orderStatus ?? po.status ?? 'PENDING') as OrderStatus,
            supplierName: po.supplierName ?? ''
          });
          this.orders = res.map(mapToOrder);
          this.applyFilter();
        }
      });
  }

  onCampChange(): void {
    this.loadOrders();
  }

  clearSelection(): void {
    this.selectedCampId = undefined;
    this.loadOrders();
  }

  onStatusChange(): void {
    this.loadOrders();
  }

  applyFilter(): void {
    let result = [...this.orders];

    if (this.selectedCampId) {
      result = result.filter(o => o.campId === this.selectedCampId);
    }
    if (this.selectedStatus !== 'ALL') {
      result = result.filter(o => o.status === this.selectedStatus);
    }

    this.filteredOrders = result;
  }
  viewOrderDetailsPopup(order: CampOrderItem): void {
    this.selectedOrder = order;
    this.orderLines = [];
    this.campsService.getCampPurchaseOrderLines(order.purchaseOrderId).subscribe({
      next: (response: any) => {
        const asArray = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.content)
              ? response.content
              : response
                ? [response]
                : [];

        this.orderLines = asArray.map((line: any) => ({
          id: line.id ?? line.orderLineId,
          medicineName: line.medicineName ?? line.medicationName ?? '',
          orderedQuantity: line.orderedQuantity ?? line.requestedQuantity ?? 0,
          acceptedQuantity: line.acceptedQuantity ?? line.requestedQuantity ?? 0,
          unitPrice: line.unitPrice ?? line.price ?? 0,
          totalPrice: line.totalPrice ?? ((line.acceptedQuantity ?? line.requestedQuantity ?? 0) * (line.unitPrice ?? line.price ?? 0)),
          remarks: line.remarks ?? '',
          selected: true
        }));

        // Fallback if no lines returned
        if (this.orderLines.length === 0) {
          this.orderLines = [
            { id: 1, medicineName: 'Paracetamol 500mg', orderedQuantity: 200, acceptedQuantity: 200, unitPrice: 5, totalPrice: 1000, remarks: '', selected: true },
            { id: 2, medicineName: 'Ibuprofen 200mg', orderedQuantity: 120, acceptedQuantity: 110, unitPrice: 4, totalPrice: 480, remarks: '', selected: true }
          ];
        }

        this.displayOrderDialog = true;
      },
      error: (error: any) => {
        console.error('Error loading purchase order lines:', error);
        // Keep placeholder for visibility on error
        this.orderLines = [
          { id: 1, medicineName: 'Paracetamol 500mg', orderedQuantity: 200, acceptedQuantity: 200, unitPrice: 5, totalPrice: 1000, remarks: '', selected: true },
          { id: 2, medicineName: 'Ibuprofen 200mg', orderedQuantity: 120, acceptedQuantity: 110, unitPrice: 4, totalPrice: 480, remarks: '', selected: true }
        ];
        this.displayOrderDialog = true;
      }
    });
  }

  approveSelected(): void {
    if (!this.selectedOrder) return;

    const selectedLines = this.orderLines
      .filter(l => l.selected)
      .map(l => ({
        orderLineId: l.id,
        acceptedQuantity: l.acceptedQuantity ?? 0,
        unitPrice: l.unitPrice ?? 0,
        remarks: l.remarks ?? ''
      }));

    const payload = {
      purchaseOrderId: this.selectedOrder.purchaseOrderId,
      status: 'ACCEPTED',
      remarks: this.selectedOrder.comments || '',
      orderLines: selectedLines
    };
    // {
    //   "purchaseOrderId": 123,
    //   "orderStatus": "PARTIALLY_ACCEPTED",
    //   "remarks": "Review completed. Some items are out of stock.",
    //   "orderLines": [
    //     {
    //       "orderLineId": 1001,
    //       "approvedQuantity": 500,
    //       "approvedUnitPrice": 2.50,
    //       "lineStatus": "APPROVED",
    //       "supplierComment": "Available and approved"
    //     },
    //     {
    //       "orderLineId": 1002,
    //       "approvedQuantity": 100,
    //       "approvedUnitPrice": 5.75,
    //       "lineStatus": "PARTIAL",
    //       "supplierComment": "Only 100 units available"
    //     },
    //     {
    //       "orderLineId": 1003,
    //       "approvedQuantity": 0,
    //       "approvedUnitPrice": 0.00,
    //       "lineStatus": "REJECTED",
    //       "supplierComment": "Out of stock"
    //     }
    //   ]
    // }

    this.campsService.reviewCampPurchaseOrder(this.selectedOrder.purchaseOrderId, payload).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: response?.message || 'Purchase order approved.'
        });
        this.displayOrderDialog = false;
        this.loadOrders();
      },
      error: (error: any) => {
        console.error('Error approving purchase order:', error);
        const detail = error?.error?.message || 'Failed to approve purchase order.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail
        });
      }
    });
  }
  getStatusSeverity(status: OrderStatus): 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'warning';
    }
  }
}
