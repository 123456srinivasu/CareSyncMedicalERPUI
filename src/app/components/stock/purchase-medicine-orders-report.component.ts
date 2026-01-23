import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CampsService } from '../../core/services/camps.service';
import { finalize } from 'rxjs/operators';
import { RippleModule } from 'primeng/ripple';




type OrderStatus = 'CREATED' | 'ACCEPTED' | 'REJECTED' | 'PARTIAL';
type OrderStatusFilter = 'ALL' | OrderStatus;

interface PurchaseOrderReport { 
  purchaseOrderId: number;
  supplierName: string;
  campName: string;
  campId: number;
  pharmacySupplierId: number;
  orderDate?: string | Date;
  orderStatus: OrderStatus;
  remarks: string;
  totalAmount?: number | null;
  orderLines?: PurchaseOrderLine[];
  reviewedAt?: string | Date | null;
  requestedAt?: string | Date;
}

interface PurchaseOrderLine {
  orderLineId: number;
  medicationName: string;
  medicationId: number;
  requestedQuantity: number;
  approvedQuantity: number;
  approvedUnitPrice?: number | null;
  lineStatus?: string;
  unitPrice?: number;
  supplierComment?: string | null;
}

@Component({
  selector: 'app-purchase-medicine-orders-report',
  standalone: true,
  imports: [
    CommonModule,
    RippleModule,
    FormsModule,
    CardModule,
    TableModule,
    SelectModule,
    TagModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './purchase-medicine-orders-report.component.html',
  styleUrl: './purchase-medicine-orders-report.component.scss'
})
export class PurchaseMedicineOrdersReportComponent implements OnInit{
  constructor(private router: Router, private campsService: CampsService) {}

  statusOptions: { label: string; value: OrderStatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Created', value: 'CREATED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Partial', value: 'PARTIAL' }
  ];
  selectedOrder: PurchaseOrderReport | undefined;

  selectedStatus: OrderStatusFilter = 'ALL';
  searchText: string = '';
  loading = false;
  errorMessage = '';
  expandedRows: { [key: string]: boolean } = {};
  customers!: any[];

  orders: PurchaseOrderReport[] = [];

  filteredOrders: PurchaseOrderReport[] = [...this.orders];

  ngOnInit(): void {
    this.loadOrders();
    // this.filteredOrders=[
    //     {
    //         "purchaseOrderId": 1,
    //         "campId": 32,
    //         "campName": "camp11",
    //         "pharmacySupplierId": 2,
    //         "supplierName": "Koch Organics",
    //         "orderStatus": "CREATED",
    //         "requestedAt": "2026-01-19T10:47:11.000+00:00",
    //         "reviewedAt": null,
    //         "remarks": "test Comments",
    //         "orderLines": [
    //             {
    //                 "orderLineId": 1,
    //                 "medicationId": 3,
    //                 "medicationName": "MetPharma",
    //                 "requestedQuantity": 100,
    //                 "approvedQuantity": 0,
    //                 "approvedUnitPrice": null,
    //                 "lineStatus": "REQUESTED",
    //                 "supplierComment": null
    //             }
    //         ]
    //     },    
    //     {
    //         "purchaseOrderId": 6,
    //         "campId": 32,
    //         "campName": "camp11",
    //         "pharmacySupplierId": 1,
    //         "supplierName": "Sun Pharma",
    //         "orderStatus": "CREATED",
    //         "requestedAt": "2026-01-19T18:34:11.000+00:00",
    //         "reviewedAt": null,
    //         "remarks": "",
    //         "orderLines": [
    //             {
    //                 "orderLineId": 6,
    //                 "medicationId": 1,
    //                 "medicationName": "Paracetamol 650",
    //                 "requestedQuantity": 100,
    //                 "approvedQuantity": 0,
    //                 "approvedUnitPrice": null,
    //                 "lineStatus": "REQUESTED",
    //                 "supplierComment": null
    //             },
    //             {
    //                 "orderLineId": 7,
    //                 "medicationId": 4,
    //                 "medicationName": "INSULIN in units (INJ)",
    //                 "requestedQuantity": 1555,
    //                 "approvedQuantity": 0,
    //                 "approvedUnitPrice": null,
    //                 "lineStatus": "REQUESTED",
    //                 "supplierComment": null
    //             }
    //         ]
    //     },
    
    //     {
    //         "purchaseOrderId": 8,
    //         "campId": 27,
    //         "campName": "Ongolu",
    //         "pharmacySupplierId": 1,
    //         "supplierName": "Sun Pharma",
    //         "orderStatus": "CREATED",
    //         "requestedAt": "2026-01-20T17:25:55.000+00:00",
    //         "reviewedAt": null,
    //         "remarks": "",
    //         "orderLines": [
    //             {
    //                 "orderLineId": 9,
    //                 "medicationId": 1,
    //                 "medicationName": "Paracetamol 650",
    //                 "requestedQuantity": 1000,
    //                 "approvedQuantity": 0,
    //                 "approvedUnitPrice": null,
    //                 "lineStatus": "REQUESTED",
    //                 "supplierComment": null
    //             },
    //             {
    //                 "orderLineId": 10,
    //                 "medicationId": 5,
    //                 "medicationName": "ATENELON 50 mg + AMLODIPINE 5 mg (AM+AT)",
    //                 "requestedQuantity": 2000,
    //                 "approvedQuantity": 0,
    //                 "approvedUnitPrice": null,
    //                 "lineStatus": "REQUESTED",
    //                 "supplierComment": null
    //             }
    //         ]
    //     },
     
    // ]
    // this.customers = [
    //     {
    //       id: 1001,
    //       name: 'Josephine Darakjy',
    //       country: {
    //         name: 'Egypt',
    //         code: 'eg',
    //       },
    //       company: 'Chanay, Jeffrey A Esq',
    //       date: '2019-02-09',
    //       status: 'proposal',
    //       verified: true,
    //       activity: 0,
    //       representative: {
    //         name: 'Srini Ganesan',
    //         image: 'amyelsner.png',
    //         tblPatientId: 15,
    //         mrNumber: 'MR2026004',
    //         firstName: 'asdasd',
    //         lastName: 'sdasd',
    //         fatherName: 'asdsad',
    //         age: 22,
    //         weight: 22.0,
    //         mobileNumber: '4444444444',
    //         gender: 'Male',
    //         bloodGroup: 'A+',
    //         maritalStatus: 'Married',
    //       },
    //       balance: 82429,
    //     },
  
    //     {
    //       id: 1013,
    //       name: 'Graciela Ruta',
    //       country: {
    //         name: 'Chile',
    //         code: 'cl',
    //       },
    //       company: 'Buckley Miller & Wright',
    //       date: '2016-07-25',
    //       status: 'negotiation',
    //       verified: false,
    //       activity: 59,
    //       representative: {
    //         name: 'Srini Ganesan',
    //         image: 'amyelsner.png',
    //         tblPatientId: 15,
    //         mrNumber: 'MR2026004',
    //         firstName: 'asdasd',
    //         lastName: 'sdasd',
    //         fatherName: 'asdsad',
    //         age: 22,
    //         weight: 22.0,
    //         mobileNumber: '4444444444',
    //         gender: 'Male',
    //         bloodGroup: 'A+',
    //         maritalStatus: 'Married',
    //       },
    //       balance: 45250,
    //     },
  
    //     {
    //       id: 1013,
    //       name: 'Graciela Ruta',
    //       country: {
    //         name: 'Chile',
    //         code: 'cl',
    //       },
    //       company: 'Buckley Miller & Wright',
    //       date: '2016-07-25',
    //       status: 'negotiation',
    //       verified: false,
    //       activity: 59,
    //       representative: {
    //         name: 'Venkat',
    //         image: 'amyelsner.png',
    //         tblPatientId: 15,
    //         mrNumber: 'MR2026004',
    //         firstName: 'asdasd',
    //         lastName: 'sdasd',
    //         fatherName: 'asdsad',
    //         age: 22,
    //         weight: 22.0,
    //         mobileNumber: '4444444444',
    //         gender: 'Male',
    //         bloodGroup: 'A+',
    //         maritalStatus: 'Married',
    //       },
    //       balance: 45250,
    //     },
    //     {
    //       id: 1014,
    //       name: 'Graciela Ruta',
    //       country: {
    //         name: 'Chile',
    //         code: 'cl',
    //       },
    //       company: 'Buckley Miller & Wright',
    //       date: '2016-07-25',
    //       status: 'negotiation',
    //       verified: false,
    //       activity: 59,
    //       representative: {
    //         name: 'Venkat',
    //         image: 'amyelsner.png',
    //         tblPatientId: 15,
    //         mrNumber: 'MR2026004',
    //         firstName: 'asdasd',
    //         lastName: 'sdasd',
    //         fatherName: 'asdsad',
    //         age: 22,
    //         weight: 22.0,
    //         mobileNumber: '4444444444',
    //         gender: 'Male',
    //         bloodGroup: 'A+',
    //         maritalStatus: 'Married',
    //       },
    //       balance: 45250,
    //     },
    //   ];
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.campsService.getCampPurchaseOrders()
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

          this.orders = asArray.map((po: any) => {
            // const orderLines = po.orderLines || [];
            // const totalAmount = orderLines.reduce((sum: number, line: any) => {
            //   const qty = line.approvedQuantity ?? line.requestedQuantity ?? 0;
            //   const price = line.approvedUnitPrice ?? line.unitPrice ?? 0;
            //   return sum + qty * price;
            // }, 0);

            return po;

            // return {
            //   orderId: po.purchaseOrderId ?? po.id ?? 0,
            //   supplierName: po.supplierName ?? '',
            //   campName: po.campName ?? '',
            //   orderDate: po.requestedAt ?? po.createdAt ?? '',
            //   status: (po.orderStatus ?? po.status ?? 'PENDING') as OrderStatus,
            //   totalAmount,
            //   orderLines: orderLines.map((l: any) => ({
            //     orderLineId: l.orderLineId ?? l.id ?? 0,
            //     medicationName: l.medicationName ?? l.medicineName ?? '',
            //     requestedQuantity: l.requestedQuantity ?? 0,
            //     approvedQuantity: l.approvedQuantity ?? 0,
            //     approvedUnitPrice: l.approvedUnitPrice ?? 0,
            //     lineStatus: l.lineStatus ?? '',
            //     supplierComment: l.supplierComment ?? ''
            //   }))
            // };
          });
console.log('orders-==>',this.orders);
          this.onFilterChange();
        },
        error: (error: any) => {
          console.error('Error loading purchase orders:', error);
          this.errorMessage = error?.error?.message || 'Failed to load purchase orders.';
          this.orders = [];
          this.filteredOrders = [];
        }
      });
  }

  onFilterChange(): void {
    let result = [...this.orders];

    if (this.selectedStatus !== 'ALL') {
      result = result.filter(o => o.orderStatus === this.selectedStatus);
    }

    if (this.searchText && this.searchText.trim()) {
      const term = this.searchText.toLowerCase();
      result = result.filter(o =>
        o.supplierName.toLowerCase().includes(term) ||
        o.campName.toLowerCase().includes(term) ||
        o.purchaseOrderId.toString().includes(term)
      );
    }

    this.filteredOrders = result;
console.log('filteredOrders-==>',this.filteredOrders);

  }

  getStatusSeverity(status: OrderStatus): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'CREATED':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      case 'PARTIAL':
      default:
        return 'info';
    }
  }

  goToPurchase(): void {
    this.router.navigate(['/stock/purchase-medicine']);
  }

  onRowExpand(event: any): void {
    const key = (event?.data?.purchaseOrderId ?? '').toString();
    if (key) {
      this.expandedRows[key] = true;
    }
    console.log('expandedRows-==>',this.expandedRows);
  }

  onRowCollapse(event: any): void {
    const key = (event?.data?.purchaseOrderId ?? '').toString();
    if (key && this.expandedRows[key]) {
      delete this.expandedRows[key];
    }
    console.log('expandedRows-==>',this.expandedRows);
  }

  calculateCustomerTotal(name: string) {
    let total = 0;

    if (this.customers) {
      for (let customer of this.customers) {
        if (customer.representative?.name === name) {
          total++;
        }
      }
    }

    return total;
  }
  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }

    // fallback for primeng 'severity' property
    return undefined;
  }
}
