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
         
          this.orders = [];
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

        this.displayOrderDialog = true;
      },
      error: (error: any) => {
        console.error('Error loading purchase order lines:', error);
        this.orderLines = [];
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
        approvedQuantity: l.acceptedQuantity ?? 0,
        approvedUnitPrice: l.unitPrice ?? 0,
        lineStatus: 'APPROVED',
        supplierComment: l.remarks ?? '',
      }));

    const payload = {
      purchaseOrderId: this.selectedOrder.purchaseOrderId,
      orderStatus: 'ACCEPTED',
      remarks: this.selectedOrder.comments || '',
      orderLines: selectedLines
    };   

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
