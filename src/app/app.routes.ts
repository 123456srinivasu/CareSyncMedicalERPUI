import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    path: 'staff',
    loadComponent: () => import('./components/staff/staff.component').then(m => m.StaffComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  }
];

