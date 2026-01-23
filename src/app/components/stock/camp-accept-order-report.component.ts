import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { CampsService } from '../../core/services/camps.service';

type OrderStatus = 'CREATED' | 'PENDING' | 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED' | 'PARTIAL';
type OrderStatusFilter = 'ALL' | OrderStatus;

interface CampOrderReport {
  purchaseOrderId: number;
  campName: string;
  supplierName: string;
  orderStatus: OrderStatus;
  requestedAt?: string | Date;
  remarks?: string;
  totalAmount: number;
}

@Component({
  selector: 'app-camp-accept-order-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    TagModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './camp-accept-order-report.component.html',
  styleUrl: './camp-accept-order-report.component.scss'
})
export class CampAcceptOrderReportComponent implements OnInit {
  private readonly campsService = inject(CampsService);
  private readonly messageService = inject(MessageService);

  loading = false;
  errorMessage = '';
  searchText = '';
  selectedStatus: OrderStatusFilter = 'ALL';

  statusOptions: { label: string; value: OrderStatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Created', value: 'CREATED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Partially Accepted', value: 'PARTIALLY_ACCEPTED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Partial', value: 'PARTIAL' }
  ];

  orders: CampOrderReport[] = [];
  filteredOrders: CampOrderReport[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.campsService.getCampPurchaseOrders()
      .pipe(finalize(() => (this.loading = false)))
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

          this.orders = asArray.map((po: any) => {
            const orderLines = Array.isArray(po.orderLines) ? po.orderLines : [];
            const totalAmount = orderLines.reduce((sum: number, line: any) => {
              const qty = line.approvedQuantity ?? line.requestedQuantity ?? 0;
              const price = line.approvedUnitPrice ?? line.unitPrice ?? 0;
              return sum + qty * price;
            }, 0);

            return {
              purchaseOrderId: po.purchaseOrderId ?? po.id ?? 0,
              campName: po.campName ?? '',
              supplierName: po.supplierName ?? '',
              orderStatus: (po.orderStatus ?? po.status ?? 'PENDING') as OrderStatus,
              requestedAt: po.requestedAt ?? po.createdAt ?? '',
              remarks: po.remarks ?? '',
              totalAmount
            };
          });

          this.applyFilters();
        },
        error: (error: any) => {
          console.error('Error loading camp purchase orders report:', error);
          const detail = error?.error?.message || 'Failed to load camp purchase orders.';
          this.errorMessage = detail;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail
          });
          this.orders = [];
          this.filteredOrders = [];
        }
      });
  }

  applyFilters(): void {
    let result = [...this.orders];

    if (this.selectedStatus !== 'ALL') {
      result = result.filter(o => o.orderStatus === this.selectedStatus);
    }

    if (this.searchText?.trim()) {
      const term = this.searchText.toLowerCase();
      result = result.filter(o =>
        o.campName.toLowerCase().includes(term) ||
        o.supplierName.toLowerCase().includes(term) ||
        o.purchaseOrderId.toString().includes(term)
      );
    }

    this.filteredOrders = result;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = 'ALL';
    this.applyFilters();
  }

  refresh(): void {
    this.loadOrders();
  }

  getStatusSeverity(status: OrderStatus): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'CREATED':
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
