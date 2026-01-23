import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/patients',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./components/patients/patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'patient-list',
    loadComponent: () => import('./components/patients/patient-all-list/patient-all-list.component').then(m => m.PatientAllListComponent)
  },
  {
    path: 'visits',
    loadComponent: () => import('./components/visits/visits.component').then(m => m.VisitsComponent)
  },
  {
    path: 'camps',
    loadComponent: () => import('./components/camps/camps.component').then(m => m.CampsComponent)
  },
  {
    path: 'camp-runs',
    loadComponent: () => import('./components/camp-runs/camp-runs.component').then(m => m.CampRunsComponent)
  },
  {
    path: 'medicines',
    loadComponent: () => import('./components/medicines/medicines.component').then(m => m.MedicinesComponent)
  },
  {
    path: 'stock',
    children: [
      {
        path: 'add',
        loadComponent: () => import('./components/stock/add-stock.component').then(m => m.AddStockComponent)
      },
      {
        path: 'current',
        loadComponent: () => import('./components/stock/current-stock.component').then(m => m.CurrentStockComponent)
      },
      {
        path: 'purchase-medicine',
        loadComponent: () => import('./components/stock/purchase-medicine.component').then(m => m.PurchaseMedicineComponent)
      },
      {
        path: 'purchase-medicine-orders-report',
        loadComponent: () => import('./components/stock/purchase-medicine-orders-report.component').then(m => m.PurchaseMedicineOrdersReportComponent)
      },
      {
        path: 'camp-accept-order',
        loadComponent: () => import('./components/stock/camp-accept-order.component').then(m => m.CampAcceptOrderComponent)
      },
      {
        path: 'camp-accept-order-report',
        loadComponent: () => import('./components/stock/camp-accept-order-report.component').then(m => m.CampAcceptOrderReportComponent)
      }
    ]
  },
  {
    path: 'staff',
    loadComponent: () => import('./components/staff/staff.component').then(m => m.StaffComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  }
];

