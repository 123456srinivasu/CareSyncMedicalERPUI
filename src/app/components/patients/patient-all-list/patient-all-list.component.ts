import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { PatientService } from '../../../core/services/patient.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

interface PatientRecord {
  tblPatientId?: any; // Changed to any to support string IDs if needed (e.g. temp IDs)
  photo?: string;
  first_name: string;
  last_name?: string;
  fullName?: string;
  father_name?: string;
  mr_number: string;
  city?: string;
  age?: number;
  gender?: string;
  phone?: string;
  weight?: number;
  blood_group?: string;
  marital_status?: string;
  Address?: any[];
}

@Component({
  selector: 'app-patient-all-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    FormsModule,
    CardModule,
    TagModule,
  ],
  templateUrl: './patient-all-list.component.html',
  styleUrls: ['./patient-all-list.component.scss'],
})
export class PatientAllListComponent implements OnInit {
  // 1. Data Source
  patients = signal<any[]>([]);
  loading = signal<boolean>(false);
  searchText = signal<string>('');
  customers!: any[];

  // 1.1 Tab State
  activeTab = signal<string>('Patient');

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  // 2. Track expanded rows using a Signal
  // The key will be the 'tblPatientId'
  expandedRows = signal<{ [key: string]: boolean }>({});

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

  ngOnInit() {
    this.customers = [
      {
        id: 1001,
        name: 'Josephine Darakjy',
        country: {
          name: 'Egypt',
          code: 'eg',
        },
        company: 'Chanay, Jeffrey A Esq',
        date: '2019-02-09',
        status: 'proposal',
        verified: true,
        activity: 0,
        representative: {
          name: 'Srini Ganesan',
          image: 'amyelsner.png',
          tblPatientId: 15,
          mrNumber: 'MR2026004',
          firstName: 'asdasd',
          lastName: 'sdasd',
          fatherName: 'asdsad',
          age: 22,
          weight: 22.0,
          mobileNumber: '4444444444',
          gender: 'Male',
          bloodGroup: 'A+',
          maritalStatus: 'Married',
        },
        balance: 82429,
      },

      {
        id: 1013,
        name: 'Graciela Ruta',
        country: {
          name: 'Chile',
          code: 'cl',
        },
        company: 'Buckley Miller & Wright',
        date: '2016-07-25',
        status: 'negotiation',
        verified: false,
        activity: 59,
        representative: {
          name: 'Srini Ganesan',
          image: 'amyelsner.png',
          tblPatientId: 15,
          mrNumber: 'MR2026004',
          firstName: 'asdasd',
          lastName: 'sdasd',
          fatherName: 'asdsad',
          age: 22,
          weight: 22.0,
          mobileNumber: '4444444444',
          gender: 'Male',
          bloodGroup: 'A+',
          maritalStatus: 'Married',
        },
        balance: 45250,
      },

      {
        id: 1013,
        name: 'Graciela Ruta',
        country: {
          name: 'Chile',
          code: 'cl',
        },
        company: 'Buckley Miller & Wright',
        date: '2016-07-25',
        status: 'negotiation',
        verified: false,
        activity: 59,
        representative: {
          name: 'Venkat',
          image: 'amyelsner.png',
          tblPatientId: 15,
          mrNumber: 'MR2026004',
          firstName: 'asdasd',
          lastName: 'sdasd',
          fatherName: 'asdsad',
          age: 22,
          weight: 22.0,
          mobileNumber: '4444444444',
          gender: 'Male',
          bloodGroup: 'A+',
          maritalStatus: 'Married',
        },
        balance: 45250,
      },
      {
        id: 1014,
        name: 'Graciela Ruta',
        country: {
          name: 'Chile',
          code: 'cl',
        },
        company: 'Buckley Miller & Wright',
        date: '2016-07-25',
        status: 'negotiation',
        verified: false,
        activity: 59,
        representative: {
          name: 'Venkat',
          image: 'amyelsner.png',
          tblPatientId: 15,
          mrNumber: 'MR2026004',
          firstName: 'asdasd',
          lastName: 'sdasd',
          fatherName: 'asdsad',
          age: 22,
          weight: 22.0,
          mobileNumber: '4444444444',
          gender: 'Male',
          bloodGroup: 'A+',
          maritalStatus: 'Married',
        },
        balance: 45250,
      },
    ];
    console.log('customers-==>',this.customers);
  }

  onSearch() {
    console.log('Searching for:', this.searchText());
    // Filter logic goes here
  }
}
