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
  //patients = signal<any[]>([]);
  loading = signal<boolean>(false);
  searchText = signal<string>('');
  customers!: any[];
  camps: any[] = [];
  patients: any[] = [];
  medicinesMaster: any[] = [];
  doctorsMaster: any[] = [];
  illnessMaster: any[] = [];
  discountMaster: any[] = [];

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
    this.patients = [
      {
        patientId: 'P-1001',
        name: 'Ramesh Kumar',
        fatherName: 'Ramesh',
        city: 'Akkapalem',
        age: 55,
        diagnosis: 'Diabetes',
        diseases: ['Diabetic', 'Asthma'],
        campRx: ['Metformin', 'Farxiga', 'Jardiance'],
        outsideRx: ['Ozempic', 'Mounjaro', 'Trulicity'],
        comments:
          'Individuals with poorly controlled diabetes (and obesity) often have more severe asthma symptoms.',
        campsAttended: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            diagnosis: 'Diabetes',
            diseases: ['Diabetic', 'Asthma'],
            campRx: ['Metformin', 'Farxiga', 'Jardiance'],
            outsideRx: ['Ozempic', 'Mounjaro', 'Trulicity'],
            comments:
              'Individuals with poorly controlled diabetes (and obesity) often have more severe asthma symptoms.',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
              {
                medicineId: 2,
                medicineName: 'Calcium Tablet',
                dosage: '0-1-0',
                days: 15,
                quantity: 15,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1002',
        name: 'Sita Devi',
        fatherName: 'Raju',
        city: 'Chittela',
        age: 38,

        diagnosis: 'Viral Fever',
        diseases: ['HTN', 'Diabetic'],
        campRx: ['Lisinopril', 'Amlodipine'],
        outsideRx: ['Chlorthalidone'],
        comments: 'Regular exercise and reduced salt intake (DASH diet) are critical.',
        campsAttended: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            diagnosis: 'Viral Fever',
            diseases: ['HTN', 'Diabetic'],
            campRx: ['Lisinopril', 'Amlodipine'],
            outsideRx: ['Chlorthalidone'],
            comments: 'Regular exercise and reduced salt intake (DASH diet) are critical.',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Paracetamol 650mg',
                dosage: '1-1-1',
                days: 5,
                quantity: 15,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1003',
        name: 'Lakshmi',
        fatherName: '',
        city: 'Nirmal',
        age: 62,

        diagnosis: 'Vision Issue',
        diseases: [],
        campRx: [],
        outsideRx: [],
        comments: '',
        medicines: [
          { medicineId: 6, medicineName: 'Eye Drops', dosage: '0-0-1', days: 10, quantity: 1 },
        ],
        campsAttended: [
          {
            campId: 'CAMP-002',
            campName: 'Eye Checkup Camp – Nirmal',
            date: '2026-01-15',
            diagnosis: 'Vision Issue',
            diseases: [],
            campRx: [],
            outsideRx: [],
            comments: '',
            medicines: [
              { medicineId: 6, medicineName: 'Eye Drops', dosage: '0-0-1', days: 10, quantity: 1 },
            ],
          },
        ],
      },

      {
        patientId: 'P-1004',
        name: 'Anil Varma',
        fatherName: 'Srinivas',
        city: 'Karimnagar',
        age: 42,

        diagnosis: 'Type 2 Diabetes',
        diseases: ['Diabetic'],
        campRx: ['Metformin'],
        outsideRx: [],
        comments: 'Diet and exercise advised',
        campsAttended: [
          {
            campId: 'CAMP-006',
            campName: 'Diabetes Screening Camp – Karimnagar',
            date: '2026-03-08',
            diagnosis: 'Type 2 Diabetes',
            diseases: ['Diabetic'],
            campRx: ['Metformin'],
            outsideRx: [],
            comments: 'Diet and exercise advised',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1005',
        name: 'Sunita Reddy',
        fatherName: 'Narasimha',
        city: 'Hyderabad',
        age: 45,

        diagnosis: 'Thyroid',
        diseases: ['Thyroid'],
        campRx: ['Thyronorm'],
        outsideRx: [],
        comments: 'Regular monitoring required',
        campsAttended: [
          {
            campId: 'CAMP-004',
            campName: 'Free Medical Camp – Hyderabad',
            date: '2026-02-20',
            diagnosis: 'Thyroid',
            diseases: ['Thyroid'],
            campRx: ['Thyronorm'],
            outsideRx: [],
            comments: 'Regular monitoring required',
            medicines: [
              {
                medicineId: 8,
                medicineName: 'Thyronorm 50mcg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1006',
        name: 'Mohan Lal',
        fatherName: 'Govind',
        city: 'Warangal',
        age: 60,
        diagnosis: 'Joint Pain',
        diseases: ['Arthritis'],
        campRx: ['Glucosamine'],
        outsideRx: [],
        comments: 'Physiotherapy suggested',
        campsAttended: [
          {
            campId: 'CAMP-005',
            campName: 'Rural Health Camp – Warangal',
            date: '2026-03-02',
            diagnosis: 'Joint Pain',
            diseases: ['Arthritis'],
            campRx: ['Glucosamine'],
            outsideRx: [],
            comments: 'Physiotherapy suggested',
            medicines: [
              {
                medicineId: 10,
                medicineName: 'Glucosamine',
                dosage: '0-0-1',
                days: 20,
                quantity: 20,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1007',
        name: 'Rahim Khan',
        fatherName: 'Abdul',
        city: 'Adilabad',
        age: 48,

        diagnosis: 'Asthma',
        diseases: ['Asthma'],
        campRx: ['Salbutamol'],
        outsideRx: [],
        comments: 'Avoid allergens',
        campsAttended: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            diagnosis: 'Asthma',
            diseases: ['Asthma'],
            campRx: ['Salbutamol'],
            outsideRx: [],
            comments: 'Avoid allergens',
            medicines: [
              {
                medicineId: 12,
                medicineName: 'Salbutamol Inhaler',
                dosage: 'As needed',
                days: 30,
                quantity: 1,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1008',
        name: 'Renuka',
        fatherName: 'Ravi',
        city: 'Vijayawada',
        age: 29,

        diagnosis: 'Anemia',
        diseases: ['Anemia'],
        campRx: ['Iron Tablets'],
        outsideRx: [],
        comments: 'Hb low',
        campsAttended: [
          {
            campId: 'CAMP-003',
            campName: 'Free Medical Camp – Vijayawada',
            date: '2026-02-05',
            diagnosis: 'Anemia',
            diseases: ['Anemia'],
            campRx: ['Iron Tablets'],
            outsideRx: [],
            comments: 'Hb low',
            medicines: [
              {
                medicineId: 14,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1009',
        name: 'Krishna',
        fatherName: 'Satyanarayana',
        city: 'Warangal',
        age: 65,

        diagnosis: 'Heart Disease',
        diseases: ['Cardiac'],
        campRx: ['Aspirin'],
        outsideRx: [],
        comments: 'Regular follow-up required',
        campsAttended: [
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-03-15',
            diagnosis: 'Heart Disease',
            diseases: ['Cardiac'],
            campRx: ['Aspirin'],
            outsideRx: [],
            comments: 'Regular follow-up required',
            medicines: [
              { medicineId: 15, medicineName: 'Aspirin', dosage: '1-0-0', days: 30, quantity: 30 },
            ],
          },
        ],
      },

      {
        patientId: 'P-1010',
        name: 'Farah',
        fatherName: 'Irfan',
        city: 'Guntur',
        age: 50,

        diagnosis: 'Anemia',
        diseases: ['Anemia'],
        campRx: ['Iron Tablets'],
        outsideRx: [],
        comments: '',
        campsAttended: [
          {
            campId: 'CAMP-009',
            campName: 'Women Wellness Camp – Guntur',
            date: '2026-03-25',
            diagnosis: 'Anemia',
            diseases: ['Anemia'],
            campRx: ['Iron Tablets'],
            outsideRx: [],
            comments: '',
            medicines: [
              {
                medicineId: 14,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1011',
        name: 'Suresh',
        fatherName: 'Mallesh',
        city: 'Suryapet',
        age: 36,

        diagnosis: 'Back Pain',
        diseases: ['Muscle Strain'],
        campRx: ['Pain Relief Gel'],
        outsideRx: [],
        comments: '',
        campsAttended: [
          {
            campId: 'CAMP-012',
            campName: 'Village Health Camp – Suryapet',
            date: '2026-04-10',
            diagnosis: 'Back Pain',
            diseases: ['Muscle Strain'],
            campRx: ['Pain Relief Gel'],
            outsideRx: [],
            comments: '',
            medicines: [
              {
                medicineId: 18,
                medicineName: 'Pain Relief Gel',
                dosage: 'Apply',
                days: 10,
                quantity: 1,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1012',
        name: 'Rukmini',
        fatherName: 'Subba Rao',
        city: 'Ongole',
        age: 64,

        diagnosis: 'Cataract',
        diseases: ['Eye'],
        campRx: ['Eye Drops'],
        outsideRx: [],
        comments: 'Surgery advised',
        campsAttended: [
          {
            campId: 'CAMP-013',
            campName: 'Eye & ENT Camp – Ongole',
            date: '2026-04-15',
            diagnosis: 'Cataract',
            diseases: ['Eye'],
            campRx: ['Eye Drops'],
            outsideRx: [],
            comments: 'Surgery advised',
            medicines: [
              { medicineId: 6, medicineName: 'Eye Drops', dosage: '0-0-1', days: 10, quantity: 1 },
            ],
          },
        ],
      },

      {
        patientId: 'P-1013',
        name: 'Naresh',
        fatherName: 'Ranga',
        city: 'Vizag',
        age: 54,
        campsAttended: [
          {
            campId: 'CAMP-015',
            campName: 'General Health Camp – Vizag',
            date: '2026-04-25',
            diagnosis: 'Diabetes',
            diseases: ['Diabetic'],
            campRx: ['Metformin'],
            outsideRx: [],
            comments: '',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1014',
        name: 'Padma',
        fatherName: 'Venkat',
        city: 'Nellore',
        age: 52,
        campsAttended: [
          {
            campId: 'CAMP-010',
            campName: 'Senior Citizen Health Camp – Nellore',
            date: '2026-03-30',
            diagnosis: 'Hypertension',
            diseases: ['HTN'],
            campRx: ['Amlodipine'],
            outsideRx: [],
            comments: '',
            medicines: [
              {
                medicineId: 3,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1015',
        name: 'Imran',
        fatherName: 'Salim',
        city: 'Hyderabad',
        age: 35,
        campsAttended: [
          {
            campId: 'CAMP-011',
            campName: 'Urban Health Camp – Secunderabad',
            date: '2026-04-05',
            diagnosis: 'Migraine',
            diseases: ['Migraine'],
            campRx: ['Sumatriptan'],
            outsideRx: [],
            comments: 'Avoid triggers',
            medicines: [
              {
                medicineId: 11,
                medicineName: 'Sumatriptan',
                dosage: 'As needed',
                days: 10,
                quantity: 5,
              },
            ],
          },
        ],
      },

      {
        patientId: 'P-1016',
        name: 'Venkat Rao',
        fatherName: 'Narasimha',
        city: 'Nirmal',
        age: 68,
        campsAttended: [
          {
            campId: 'CAMP-004',
            campName: 'Rehab Camp – Nirmal',
            date: '2026-03-01',
            diagnosis: 'Stroke Recovery',
            diseases: ['Stroke'],
            campRx: ['Physiotherapy'],
            outsideRx: [],
            comments: 'Long-term rehab required',
            medicines: [],
          },
        ],
      },
    ];

    this.camps = [
      {
        campId: 'CAMP-001',
        campName: 'Free Medical Camp – Adilabad',
        date: '2026-01-12',
        location: 'Adilabad',
        patientCount: 6,
        patients: [
          {
            patientId: 'P-1001',
            name: 'Ramesh Kumar',
            age: 55,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-1002',
            name: 'Sita Devi',
            age: 38,
            diagnosis: 'Viral Fever',
            medicines: [
              {
                medicineId: 3,
                medicineName: 'Paracetamol 650mg',
                dosage: '1-1-1',
                days: 5,
                quantity: 15,
              },
            ],
          },
          {
            patientId: 'P-1003',
            name: 'Anil Varma',
            age: 42,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-1004',
            name: 'Kiran Rao',
            age: 29,
            diagnosis: 'Asthma',
            medicines: [
              {
                medicineId: 5,
                medicineName: 'Salbutamol Inhaler',
                dosage: 'As needed',
                days: 30,
                quantity: 1,
              },
            ],
          },
          {
            patientId: 'P-1005',
            name: 'Sunita Reddy',
            age: 45,
            diagnosis: 'Thyroid',
            medicines: [
              {
                medicineId: 6,
                medicineName: 'Thyronorm 50mcg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-1006',
            name: 'Mohan Lal',
            age: 60,
            diagnosis: 'Joint Pain',
            medicines: [
              {
                medicineId: 7,
                medicineName: 'Glucosamine',
                dosage: '0-0-1',
                days: 20,
                quantity: 20,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-002',
        campName: 'Eye Checkup Camp – Nirmal',
        date: '2026-01-15',
        location: 'Nirmal',
        patientCount: 1,
        patients: [
          {
            patientId: 'P-1007',
            name: 'Lakshmi',
            age: 62,
            diagnosis: 'Vision Issue',
            medicines: [
              { medicineId: 8, medicineName: 'Eye Drops', dosage: '0-0-1', days: 10, quantity: 1 },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-003',
        campName: 'Free Medical Camp – Vijayawada',
        date: '2026-02-05',
        location: 'Vijayawada',
        patientCount: 5,
        patients: [
          {
            patientId: 'P-2001',
            name: 'Srinivas Rao',
            age: 48,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-2002',
            name: 'Padma',
            age: 52,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-2003',
            name: 'Harish',
            age: 34,
            diagnosis: 'Gastritis',
            medicines: [
              {
                medicineId: 9,
                medicineName: 'Pantoprazole 40mg',
                dosage: '1-0-0',
                days: 10,
                quantity: 10,
              },
            ],
          },
          {
            patientId: 'P-2004',
            name: 'Lakshman',
            age: 61,
            diagnosis: 'Joint Pain',
            medicines: [
              {
                medicineId: 7,
                medicineName: 'Glucosamine',
                dosage: '0-0-1',
                days: 20,
                quantity: 20,
              },
            ],
          },
          {
            patientId: 'P-2005',
            name: 'Renuka',
            age: 29,
            diagnosis: 'Anemia',
            medicines: [
              {
                medicineId: 10,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-004',
        campName: 'Free Medical Camp – Hyderabad',
        date: '2026-02-20',
        location: 'Hyderabad',
        patientCount: 7,
        patients: [
          {
            patientId: 'P-3001',
            name: 'Raghavendra',
            age: 58,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-3002',
            name: 'Sujatha',
            age: 46,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-3003',
            name: 'Imran',
            age: 35,
            diagnosis: 'Asthma',
            medicines: [
              {
                medicineId: 5,
                medicineName: 'Salbutamol Inhaler',
                dosage: 'As needed',
                days: 30,
                quantity: 1,
              },
            ],
          },
          {
            patientId: 'P-3004',
            name: 'Bhavani',
            age: 41,
            diagnosis: 'Migraine',
            medicines: [
              {
                medicineId: 11,
                medicineName: 'Sumatriptan',
                dosage: 'As needed',
                days: 10,
                quantity: 5,
              },
            ],
          },
          {
            patientId: 'P-3005',
            name: 'Kavya',
            age: 27,
            diagnosis: 'Thyroid',
            medicines: [
              {
                medicineId: 6,
                medicineName: 'Thyronorm 50mcg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-3006',
            name: 'Ramesh',
            age: 63,
            diagnosis: 'Joint Pain',
            medicines: [
              {
                medicineId: 7,
                medicineName: 'Glucosamine',
                dosage: '0-0-1',
                days: 20,
                quantity: 20,
              },
            ],
          },
          {
            patientId: 'P-3007',
            name: 'Farah',
            age: 50,
            diagnosis: 'Anemia',
            medicines: [
              {
                medicineId: 10,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-005',
        campName: 'Rural Health Camp – Warangal',
        date: '2026-03-02',
        location: 'Warangal',
        patientCount: 4,
        patients: [
          {
            patientId: 'P-4001',
            name: 'Prasad',
            age: 61,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-4002',
            name: 'Uma Devi',
            age: 54,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-4003',
            name: 'Suresh',
            age: 37,
            diagnosis: 'Back Pain',
            medicines: [
              {
                medicineId: 12,
                medicineName: 'Pain Relief Gel',
                dosage: 'Apply',
                days: 10,
                quantity: 1,
              },
            ],
          },
          {
            patientId: 'P-4004',
            name: 'Latha',
            age: 33,
            diagnosis: 'Anemia',
            medicines: [
              {
                medicineId: 10,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-006',
        campName: 'Diabetes Screening Camp – Karimnagar',
        date: '2026-03-08',
        location: 'Karimnagar',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-5001',
            name: 'Anil Varma',
            age: 42,
            diagnosis: 'Type 2 Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-5002',
            name: 'Sulochana',
            age: 60,
            diagnosis: 'Prediabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-0',
                days: 15,
                quantity: 15,
              },
            ],
          },
          {
            patientId: 'P-5003',
            name: 'Ravi',
            age: 35,
            diagnosis: 'Obesity',
            medicines: [
              {
                medicineId: 13,
                medicineName: 'Diet Counseling',
                dosage: 'N/A',
                days: 0,
                quantity: 0,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-007',
        campName: 'Heart Care Camp – Warangal',
        date: '2026-03-15',
        location: 'Warangal',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-6001',
            name: 'Krishna',
            age: 65,
            diagnosis: 'Heart Disease',
            medicines: [
              { medicineId: 14, medicineName: 'Aspirin', dosage: '1-0-0', days: 30, quantity: 30 },
            ],
          },
          {
            patientId: 'P-6002',
            name: 'Saritha',
            age: 50,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-6003',
            name: 'Ramesh',
            age: 59,
            diagnosis: 'High Cholesterol',
            medicines: [
              {
                medicineId: 15,
                medicineName: 'Atorvastatin',
                dosage: '0-0-1',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-008',
        campName: 'Respiratory Care Camp – Adilabad',
        date: '2026-03-20',
        location: 'Adilabad',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-7001',
            name: 'Rahim Khan',
            age: 48,
            diagnosis: 'Asthma',
            medicines: [
              {
                medicineId: 5,
                medicineName: 'Salbutamol Inhaler',
                dosage: 'As needed',
                days: 30,
                quantity: 1,
              },
            ],
          },
          {
            patientId: 'P-7002',
            name: 'Nirmala',
            age: 52,
            diagnosis: 'COPD',
            medicines: [
              {
                medicineId: 16,
                medicineName: 'Tiotropium',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-7003',
            name: 'Salman',
            age: 40,
            diagnosis: 'Bronchitis',
            medicines: [
              {
                medicineId: 17,
                medicineName: 'Cough Syrup',
                dosage: '2-2-2',
                days: 5,
                quantity: 1,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-009',
        campName: 'Women Wellness Camp – Guntur',
        date: '2026-03-25',
        location: 'Guntur',
        patientCount: 4,
        patients: [
          {
            patientId: 'P-8001',
            name: 'Lakshmi',
            age: 34,
            diagnosis: 'PCOD',
            medicines: [
              {
                medicineId: 18,
                medicineName: 'Hormonal Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-8002',
            name: 'Sravani',
            age: 28,
            diagnosis: 'Anemia',
            medicines: [
              {
                medicineId: 10,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-8003',
            name: 'Padma',
            age: 45,
            diagnosis: 'Thyroid',
            medicines: [
              {
                medicineId: 6,
                medicineName: 'Thyronorm 50mcg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-8004',
            name: 'Suma',
            age: 52,
            diagnosis: 'Menopause Issues',
            medicines: [
              {
                medicineId: 19,
                medicineName: 'Calcium + D3',
                dosage: '0-0-1',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-010',
        campName: 'Senior Citizen Health Camp – Nellore',
        date: '2026-03-30',
        location: 'Nellore',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-9001',
            name: 'Subba Rao',
            age: 72,
            diagnosis: 'Arthritis',
            medicines: [
              {
                medicineId: 7,
                medicineName: 'Glucosamine',
                dosage: '0-0-1',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-9002',
            name: 'Lakshmi',
            age: 68,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-9003',
            name: 'Nagesh',
            age: 75,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-011',
        campName: 'Urban Health Camp – Secunderabad',
        date: '2026-04-05',
        location: 'Secunderabad',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-10001',
            name: 'Arjun',
            age: 31,
            diagnosis: 'Stress',
            medicines: [
              {
                medicineId: 20,
                medicineName: 'Vitamin B Complex',
                dosage: '1-0-0',
                days: 15,
                quantity: 15,
              },
            ],
          },
          {
            patientId: 'P-10002',
            name: 'Ritika',
            age: 27,
            diagnosis: 'Migraine',
            medicines: [
              {
                medicineId: 11,
                medicineName: 'Sumatriptan',
                dosage: 'As needed',
                days: 10,
                quantity: 5,
              },
            ],
          },
          {
            patientId: 'P-10003',
            name: 'Kishore',
            age: 44,
            diagnosis: 'Gastritis',
            medicines: [
              {
                medicineId: 9,
                medicineName: 'Pantoprazole 40mg',
                dosage: '1-0-0',
                days: 10,
                quantity: 10,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-012',
        campName: 'Village Health Camp – Suryapet',
        date: '2026-04-10',
        location: 'Suryapet',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-11001',
            name: 'Shankar',
            age: 57,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-11002',
            name: 'Radha',
            age: 48,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-11003',
            name: 'Manoj',
            age: 36,
            diagnosis: 'Back Pain',
            medicines: [
              {
                medicineId: 12,
                medicineName: 'Pain Relief Gel',
                dosage: 'Apply',
                days: 10,
                quantity: 1,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-013',
        campName: 'Eye & ENT Camp – Ongole',
        date: '2026-04-15',
        location: 'Ongole',
        patientCount: 2,
        patients: [
          {
            patientId: 'P-12001',
            name: 'Rukmini',
            age: 64,
            diagnosis: 'Cataract',
            medicines: [
              { medicineId: 8, medicineName: 'Eye Drops', dosage: '0-0-1', days: 10, quantity: 1 },
            ],
          },
          {
            patientId: 'P-12002',
            name: 'Siva',
            age: 39,
            diagnosis: 'Sinusitis',
            medicines: [
              {
                medicineId: 21,
                medicineName: 'Antihistamine',
                dosage: '1-0-1',
                days: 10,
                quantity: 20,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-014',
        campName: 'Bone & Joint Camp – Kurnool',
        date: '2026-04-20',
        location: 'Kurnool',
        patientCount: 3,
        patients: [
          {
            patientId: 'P-13001',
            name: 'Ranga Rao',
            age: 59,
            diagnosis: 'Knee Pain',
            medicines: [
              {
                medicineId: 7,
                medicineName: 'Glucosamine',
                dosage: '0-0-1',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-13002',
            name: 'Savitri',
            age: 52,
            diagnosis: 'Osteoporosis',
            medicines: [
              {
                medicineId: 19,
                medicineName: 'Calcium + D3',
                dosage: '0-0-1',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-13003',
            name: 'Mahesh',
            age: 41,
            diagnosis: 'Back Pain',
            medicines: [
              {
                medicineId: 12,
                medicineName: 'Pain Relief Gel',
                dosage: 'Apply',
                days: 10,
                quantity: 1,
              },
            ],
          },
        ],
      },

      {
        campId: 'CAMP-015',
        campName: 'General Health Camp – Vizag',
        date: '2026-04-25',
        location: 'Visakhapatnam',
        patientCount: 4,
        patients: [
          {
            patientId: 'P-14001',
            name: 'Suresh',
            age: 47,
            diagnosis: 'Hypertension',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'Amlodipine 5mg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-14002',
            name: 'Deepa',
            age: 35,
            diagnosis: 'Thyroid',
            medicines: [
              {
                medicineId: 6,
                medicineName: 'Thyronorm 50mcg',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
          {
            patientId: 'P-14003',
            name: 'Naresh',
            age: 54,
            diagnosis: 'Diabetes',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Metformin 500mg',
                dosage: '1-0-1',
                days: 30,
                quantity: 60,
              },
            ],
          },
          {
            patientId: 'P-14004',
            name: 'Anita',
            age: 29,
            diagnosis: 'Anemia',
            medicines: [
              {
                medicineId: 10,
                medicineName: 'Iron Tablets',
                dosage: '1-0-0',
                days: 30,
                quantity: 30,
              },
            ],
          },
        ],
      },
    ];

    this.medicinesMaster = [
      {
        medicineId: 1,
        medicineName: 'Metformin 500mg',
        totalDistributed: 120,
        campsFoundIn: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            patientsUsing: [
              {
                patientId: 'P-1001',
                name: 'Ramesh Kumar',
                diagnosis: 'Diabetes',
                dosage: '1-0-1',
                qtyGiven: 60,
              },
              {
                patientId: 'P-1005',
                name: 'Anil Varma',
                diagnosis: 'Type 2 Diabetes',
                dosage: '0-0-1',
                qtyGiven: 30,
              },
            ],
          },
          {
            campId: 'CAMP-006',
            campName: 'Diabetes Screening Camp – Karimnagar',
            date: '2026-03-08',
            patientsUsing: [
              {
                patientId: 'P-5002',
                name: 'Sulochana',
                diagnosis: 'Prediabetes',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 2,
        medicineName: 'Paracetamol 650mg',
        totalDistributed: 45,
        campsFoundIn: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            patientsUsing: [
              {
                patientId: 'P-1002',
                name: 'Sita Devi',
                diagnosis: 'Viral Fever',
                dosage: '1-1-1',
                qtyGiven: 15,
              },
              {
                patientId: 'P-1009',
                name: 'Mohan Lal',
                diagnosis: 'Fever',
                dosage: '1-0-1',
                qtyGiven: 10,
              },
            ],
          },
        ],
      },

      {
        medicineId: 3,
        medicineName: 'Amlodipine 5mg',
        totalDistributed: 90,
        campsFoundIn: [
          {
            campId: 'CAMP-003',
            campName: 'Free Medical Camp – Vijayawada',
            date: '2026-02-05',
            patientsUsing: [
              {
                patientId: 'P-2002',
                name: 'Padma',
                diagnosis: 'Hypertension',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-03-15',
            patientsUsing: [
              {
                patientId: 'P-6002',
                name: 'Saritha',
                diagnosis: 'Hypertension',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
              {
                patientId: 'P-6003',
                name: 'Ramesh',
                diagnosis: 'High BP',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 4,
        medicineName: 'Salbutamol Inhaler',
        totalDistributed: 12,
        campsFoundIn: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            patientsUsing: [
              {
                patientId: 'P-7001',
                name: 'Rahim Khan',
                diagnosis: 'Asthma',
                dosage: 'As needed',
                qtyGiven: 1,
              },
              {
                patientId: 'P-7003',
                name: 'Salman',
                diagnosis: 'Bronchitis',
                dosage: 'As needed',
                qtyGiven: 1,
              },
            ],
          },
        ],
      },

      {
        medicineId: 5,
        medicineName: 'Thyronorm 50mcg',
        totalDistributed: 75,
        campsFoundIn: [
          {
            campId: 'CAMP-004',
            campName: 'Free Medical Camp – Hyderabad',
            date: '2026-02-20',
            patientsUsing: [
              {
                patientId: 'P-3005',
                name: 'Kavya',
                diagnosis: 'Thyroid',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
          {
            campId: 'CAMP-015',
            campName: 'General Health Camp – Vizag',
            date: '2026-04-25',
            patientsUsing: [
              {
                patientId: 'P-14002',
                name: 'Deepa',
                diagnosis: 'Thyroid',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 6,
        medicineName: 'Iron Tablets',
        totalDistributed: 120,
        campsFoundIn: [
          {
            campId: 'CAMP-003',
            campName: 'Free Medical Camp – Vijayawada',
            date: '2026-02-05',
            patientsUsing: [
              {
                patientId: 'P-2005',
                name: 'Renuka',
                diagnosis: 'Anemia',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
          {
            campId: 'CAMP-009',
            campName: 'Women Wellness Camp – Guntur',
            date: '2026-03-25',
            patientsUsing: [
              {
                patientId: 'P-8002',
                name: 'Sravani',
                diagnosis: 'Anemia',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
              {
                patientId: 'P-8004',
                name: 'Suma',
                diagnosis: 'Anemia',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 7,
        medicineName: 'Glucosamine',
        totalDistributed: 85,
        campsFoundIn: [
          {
            campId: 'CAMP-005',
            campName: 'Rural Health Camp – Warangal',
            date: '2026-03-02',
            patientsUsing: [
              {
                patientId: 'P-4001',
                name: 'Prasad',
                diagnosis: 'Joint Pain',
                dosage: '0-0-1',
                qtyGiven: 20,
              },
            ],
          },
          {
            campId: 'CAMP-014',
            campName: 'Bone & Joint Camp – Kurnool',
            date: '2026-04-20',
            patientsUsing: [
              {
                patientId: 'P-13001',
                name: 'Ranga Rao',
                diagnosis: 'Knee Pain',
                dosage: '0-0-1',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 8,
        medicineName: 'Eye Drops',
        totalDistributed: 15,
        campsFoundIn: [
          {
            campId: 'CAMP-002',
            campName: 'Eye Checkup Camp – Nirmal',
            date: '2026-01-15',
            patientsUsing: [
              {
                patientId: 'P-1003',
                name: 'Lakshmi',
                diagnosis: 'Vision Issue',
                dosage: '0-0-1',
                qtyGiven: 1,
              },
            ],
          },
        ],
      },

      {
        medicineId: 9,
        medicineName: 'Pantoprazole 40mg',
        totalDistributed: 40,
        campsFoundIn: [
          {
            campId: 'CAMP-003',
            campName: 'Free Medical Camp – Vijayawada',
            date: '2026-02-05',
            patientsUsing: [
              {
                patientId: 'P-2003',
                name: 'Harish',
                diagnosis: 'Gastritis',
                dosage: '1-0-0',
                qtyGiven: 10,
              },
            ],
          },
        ],
      },

      {
        medicineId: 10,
        medicineName: 'Vitamin B Complex',
        totalDistributed: 60,
        campsFoundIn: [
          {
            campId: 'CAMP-011',
            campName: 'Urban Health Camp – Secunderabad',
            date: '2026-04-05',
            patientsUsing: [
              {
                patientId: 'P-10001',
                name: 'Arjun',
                diagnosis: 'Fatigue',
                dosage: '1-0-0',
                qtyGiven: 15,
              },
            ],
          },
        ],
      },

      {
        medicineId: 11,
        medicineName: 'Sumatriptan',
        totalDistributed: 20,
        campsFoundIn: [
          {
            campId: 'CAMP-004',
            campName: 'Free Medical Camp – Hyderabad',
            date: '2026-02-20',
            patientsUsing: [
              {
                patientId: 'P-3004',
                name: 'Bhavani',
                diagnosis: 'Migraine',
                dosage: 'As needed',
                qtyGiven: 5,
              },
            ],
          },
        ],
      },

      {
        medicineId: 12,
        medicineName: 'Cough Syrup',
        totalDistributed: 10,
        campsFoundIn: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            patientsUsing: [
              {
                patientId: 'P-7003',
                name: 'Salman',
                diagnosis: 'Bronchitis',
                dosage: '2-2-2',
                qtyGiven: 1,
              },
            ],
          },
        ],
      },

      {
        medicineId: 13,
        medicineName: 'Aspirin',
        totalDistributed: 35,
        campsFoundIn: [
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-03-15',
            patientsUsing: [
              {
                patientId: 'P-6001',
                name: 'Krishna',
                diagnosis: 'Heart Disease',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 14,
        medicineName: 'Atorvastatin',
        totalDistributed: 30,
        campsFoundIn: [
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-03-15',
            patientsUsing: [
              {
                patientId: 'P-6003',
                name: 'Ramesh',
                diagnosis: 'High Cholesterol',
                dosage: '0-0-1',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 15,
        medicineName: 'Calcium + D3',
        totalDistributed: 60,
        campsFoundIn: [
          {
            campId: 'CAMP-014',
            campName: 'Bone & Joint Camp – Kurnool',
            date: '2026-04-20',
            patientsUsing: [
              {
                patientId: 'P-13002',
                name: 'Savitri',
                diagnosis: 'Osteoporosis',
                dosage: '0-0-1',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 16,
        medicineName: 'Tiotropium',
        totalDistributed: 30,
        campsFoundIn: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            patientsUsing: [
              {
                patientId: 'P-7002',
                name: 'Nirmala',
                diagnosis: 'COPD',
                dosage: '1-0-0',
                qtyGiven: 30,
              },
            ],
          },
        ],
      },

      {
        medicineId: 17,
        medicineName: 'Antihistamine',
        totalDistributed: 20,
        campsFoundIn: [
          {
            campId: 'CAMP-013',
            campName: 'Eye & ENT Camp – Ongole',
            date: '2026-04-15',
            patientsUsing: [
              {
                patientId: 'P-12002',
                name: 'Siva',
                diagnosis: 'Sinusitis',
                dosage: '1-0-1',
                qtyGiven: 20,
              },
            ],
          },
        ],
      },

      {
        medicineId: 18,
        medicineName: 'Pain Relief Gel',
        totalDistributed: 15,
        campsFoundIn: [
          {
            campId: 'CAMP-012',
            campName: 'Village Health Camp – Suryapet',
            date: '2026-04-10',
            patientsUsing: [
              {
                patientId: 'P-11003',
                name: 'Manoj',
                diagnosis: 'Back Pain',
                dosage: 'Apply',
                qtyGiven: 1,
              },
            ],
          },
        ],
      },
    ];

    this.doctorsMaster = [
      {
        doctorId: 'D-001',
        doctorName: 'Dr. Anjali Sharma',
        specialization: 'General Physician',
        attendedCampCount: 1,
        consultedPatientCount: 2,
        campsWorked: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            patientsConsulted: [
              {
                patientId: 'P-1001',
                name: 'Ramesh Kumar',
                age: 55,
                diagnosis: 'Diabetes',
                followUp: 'Yes',
              },
              {
                patientId: 'P-1002',
                name: 'Sita Devi',
                age: 38,
                diagnosis: 'Viral Fever',
                followUp: 'No',
              },
            ],
          },
        ],
      },

      {
        doctorId: 'D-002',
        doctorName: 'Dr. Meena Iyer',
        specialization: 'Pediatrician',
        attendedCampCount: 1,
        consultedPatientCount: 2,
        campsWorked: [
          {
            campId: 'CAMP-004',
            campName: 'Child Health Camp – Mancherial',
            date: '2026-01-20',
            patientsConsulted: [
              {
                patientId: 'P-3001',
                name: 'Aarav',
                age: 6,
                diagnosis: 'Common Cold',
                followUp: 'No',
              },
              {
                patientId: 'P-3002',
                name: 'Ananya',
                age: 9,
                diagnosis: 'Anemia',
                followUp: 'Yes',
              },
            ],
          },
        ],
      },

      {
        doctorId: 'D-003',
        doctorName: 'Dr. Vikram Raj',
        specialization: 'Ophthalmologist',
        attendedCampCount: 1,
        consultedPatientCount: 1,
        campsWorked: [
          {
            campId: 'CAMP-002',
            campName: 'Eye Checkup Camp – Nirmal',
            date: '2026-01-15',
            patientsConsulted: [
              {
                patientId: 'P-1003',
                name: 'Lakshmi',
                age: 62,
                diagnosis: 'Cataract',
                followUp: 'Yes',
              },
            ],
          },
        ],
      },

      {
        doctorId: 'D-004',
        doctorName: 'Dr. Suresh Naik',
        specialization: 'Orthopedic',
        attendedCampCount: 1,
        consultedPatientCount: 2,
        campsWorked: [
          {
            campId: 'CAMP-005',
            campName: 'Bone & Joint Camp – Asifabad',
            date: '2026-02-02',
            patientsConsulted: [
              {
                patientId: 'P-4001',
                name: 'Mohan Rao',
                age: 58,
                diagnosis: 'Knee Osteoarthritis',
                followUp: 'Yes',
              },
              {
                patientId: 'P-4002',
                name: 'Ravi',
                age: 35,
                diagnosis: 'Lower Back Pain',
                followUp: 'No',
              },
            ],
          },
        ],
      },

      {
        doctorId: 'D-005',
        doctorName: 'Dr. Kavitha Reddy',
        specialization: 'Diabetologist',
        attendedCampCount: 1,
        consultedPatientCount: 2,
        campsWorked: [
          {
            campId: 'CAMP-006',
            campName: 'Diabetes Screening Camp – Karimnagar',
            date: '2026-02-08',
            patientsConsulted: [
              {
                patientId: 'P-5001',
                name: 'Anil Varma',
                age: 42,
                diagnosis: 'Type 2 Diabetes',
                followUp: 'Yes',
              },
              {
                patientId: 'P-5002',
                name: 'Sulochana',
                age: 60,
                diagnosis: 'Prediabetes',
                followUp: 'Yes',
              },
            ],
          },
        ],
      },

      {
        doctorId: 'D-006',
        doctorName: 'Dr. Rajesh Khanna',
        specialization: 'Cardiologist',
        attendedCampCount: 1,
        consultedPatientCount: 2,
        campsWorked: [
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-02-14',
            patientsConsulted: [
              {
                patientId: 'P-6001',
                name: 'Prasad',
                age: 61,
                diagnosis: 'Hypertension',
                followUp: 'Yes',
              },
              {
                patientId: 'P-6002',
                name: 'Uma Devi',
                age: 54,
                diagnosis: 'Ischemic Heart Disease',
                followUp: 'Yes',
              },
            ],
          },
        ],
      },

      {
        doctorId: 'D-007',
        doctorName: 'Dr. Farooq Ahmed',
        specialization: 'Pulmonologist',
        attendedCampCount: 1,
        consultedPatientCount: 2,
        campsWorked: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-02-18',
            patientsConsulted: [
              {
                patientId: 'P-7001',
                name: 'Rahim Khan',
                age: 48,
                diagnosis: 'Asthma',
                followUp: 'Yes',
              },
              {
                patientId: 'P-7002',
                name: 'Nirmala',
                age: 52,
                diagnosis: 'COPD',
                followUp: 'Yes',
              },
            ],
          },
        ],
      },
    ];

    this.illnessMaster = [
      {
        illnessId: 'ILL-001',
        illnessName: 'Insulin-Dependent Diabetes',
        severity: 'Critical',
        campsAffected: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            patientList: [
              {
                patientId: 'P-1001',
                name: 'Ramesh Kumar',
                age: 55,
                vitals: 'Sugar: 240mg/dL',
                remarks: 'Requires regular insulin',
              },
              {
                patientId: 'P-1005',
                name: 'Anil Varma',
                age: 42,
                vitals: 'Sugar: 190mg/dL',
                remarks: 'Type 1',
              },
            ],
          },
          {
            campId: 'CAMP-003',
            campName: 'Health Drive – Utnoor',
            date: '2026-02-10',
            patientList: [
              {
                patientId: 'P-3004',
                name: 'Zeenat Aman',
                age: 60,
                vitals: 'Sugar: 210mg/dL',
                remarks: 'Dose adjustment needed',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-002',
        illnessName: 'HTN (Hypertension)',
        severity: 'Chronic',
        campsAffected: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            patientList: [
              {
                patientId: 'P-1002',
                name: 'Sita Devi',
                age: 38,
                vitals: 'BP: 150/95',
                remarks: 'High sodium intake',
              },
            ],
          },
          {
            campId: 'CAMP-002',
            campName: 'Eye Checkup Camp – Nirmal',
            date: '2026-01-15',
            patientList: [
              {
                patientId: 'P-1003',
                name: 'Lakshmi',
                age: 62,
                vitals: 'BP: 160/100',
                remarks: 'Blurred vision due to BP',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-003',
        illnessName: 'Seizures / Epilepsy',
        severity: 'High',
        campsAffected: [
          {
            campId: 'CAMP-003',
            campName: 'Health Drive – Utnoor',
            date: '2026-02-10',
            patientList: [
              {
                patientId: 'P-4001',
                name: 'Rahul K.',
                age: 24,
                vitals: 'Stable',
                remarks: 'On Eptoin',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-004',
        illnessName: 'Asthma',
        severity: 'Moderate',
        campsAffected: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            patientList: [
              {
                patientId: 'P-5002',
                name: 'Kavita',
                age: 12,
                vitals: 'O2: 96%',
                remarks: 'Requires inhaler',
              },
            ],
          },
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            patientList: [
              {
                patientId: 'P-7001',
                name: 'Rahim Khan',
                age: 48,
                vitals: 'O2: 94%',
                remarks: 'Night-time wheeze',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-005',
        illnessName: 'Stroke (Recovery/Post-Op)',
        severity: 'Critical',
        campsAffected: [
          {
            campId: 'CAMP-004',
            campName: 'Rehab Camp – Nirmal',
            date: '2026-03-01',
            patientList: [
              {
                patientId: 'P-6001',
                name: 'Venkat Rao',
                age: 68,
                vitals: 'Partially paralyzed',
                remarks: 'Physiotherapy recommended',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-006',
        illnessName: 'Type 2 Diabetes',
        severity: 'Chronic',
        campsAffected: [
          {
            campId: 'CAMP-006',
            campName: 'Diabetes Screening Camp – Karimnagar',
            date: '2026-03-08',
            patientList: [
              {
                patientId: 'P-5001',
                name: 'Anil Varma',
                age: 42,
                vitals: 'Sugar: 180mg/dL',
                remarks: 'Diet control advised',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-007',
        illnessName: 'Anemia',
        severity: 'Moderate',
        campsAffected: [
          {
            campId: 'CAMP-009',
            campName: 'Women Wellness Camp – Guntur',
            date: '2026-03-25',
            patientList: [
              {
                patientId: 'P-8002',
                name: 'Sravani',
                age: 28,
                vitals: 'Hb: 9.2g/dL',
                remarks: 'Iron supplementation',
              },
            ],
          },
          {
            campId: 'CAMP-015',
            campName: 'General Health Camp – Vizag',
            date: '2026-04-25',
            patientList: [
              {
                patientId: 'P-14004',
                name: 'Anita',
                age: 29,
                vitals: 'Hb: 9.5g/dL',
                remarks: 'Follow-up needed',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-008',
        illnessName: 'Thyroid Disorder',
        severity: 'Chronic',
        campsAffected: [
          {
            campId: 'CAMP-004',
            campName: 'Free Medical Camp – Hyderabad',
            date: '2026-02-20',
            patientList: [
              {
                patientId: 'P-3005',
                name: 'Kavya',
                age: 27,
                vitals: 'TSH elevated',
                remarks: 'Continue Thyronorm',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-009',
        illnessName: 'Joint Pain / Osteoarthritis',
        severity: 'Moderate',
        campsAffected: [
          {
            campId: 'CAMP-014',
            campName: 'Bone & Joint Camp – Kurnool',
            date: '2026-04-20',
            patientList: [
              {
                patientId: 'P-13001',
                name: 'Ranga Rao',
                age: 59,
                vitals: 'Knee stiffness',
                remarks: 'Exercises advised',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-010',
        illnessName: 'COPD',
        severity: 'High',
        campsAffected: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            patientList: [
              {
                patientId: 'P-7002',
                name: 'Nirmala',
                age: 52,
                vitals: 'O2: 92%',
                remarks: 'On bronchodilators',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-011',
        illnessName: 'Migraine',
        severity: 'Moderate',
        campsAffected: [
          {
            campId: 'CAMP-004',
            campName: 'Free Medical Camp – Hyderabad',
            date: '2026-02-20',
            patientList: [
              {
                patientId: 'P-3004',
                name: 'Bhavani',
                age: 41,
                vitals: 'Stable',
                remarks: 'Trigger avoidance advised',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-012',
        illnessName: 'Heart Disease (Ischemic)',
        severity: 'Critical',
        campsAffected: [
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-03-15',
            patientList: [
              {
                patientId: 'P-6001',
                name: 'Krishna',
                age: 65,
                vitals: 'ECG abnormal',
                remarks: 'Long-term medication',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-013',
        illnessName: 'Gastritis',
        severity: 'Low',
        campsAffected: [
          {
            campId: 'CAMP-003',
            campName: 'Free Medical Camp – Vijayawada',
            date: '2026-02-05',
            patientList: [
              {
                patientId: 'P-2003',
                name: 'Harish',
                age: 34,
                vitals: 'Abdominal pain',
                remarks: 'Diet modification',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-014',
        illnessName: 'Sinusitis',
        severity: 'Low',
        campsAffected: [
          {
            campId: 'CAMP-013',
            campName: 'Eye & ENT Camp – Ongole',
            date: '2026-04-15',
            patientList: [
              {
                patientId: 'P-12002',
                name: 'Siva',
                age: 39,
                vitals: 'Nasal congestion',
                remarks: 'Antihistamine prescribed',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-015',
        illnessName: 'Back Pain',
        severity: 'Low',
        campsAffected: [
          {
            campId: 'CAMP-012',
            campName: 'Village Health Camp – Suryapet',
            date: '2026-04-10',
            patientList: [
              {
                patientId: 'P-11003',
                name: 'Manoj',
                age: 36,
                vitals: 'Muscle spasm',
                remarks: 'Physiotherapy advised',
              },
            ],
          },
        ],
      },

      {
        illnessId: 'ILL-016',
        illnessName: 'Stress / Anxiety',
        severity: 'Moderate',
        campsAffected: [
          {
            campId: 'CAMP-011',
            campName: 'Urban Health Camp – Secunderabad',
            date: '2026-04-05',
            patientList: [
              {
                patientId: 'P-10001',
                name: 'Arjun',
                age: 31,
                vitals: 'Pulse elevated',
                remarks: 'Counseling advised',
              },
            ],
          },
        ],
      },
    ];

    this.discountMaster = [
      {
        discountValue: 200,
        label: 'Highest Discount (Special Case)',
        totalRedeemed: 4000,
        camps: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            totalDiscountApplied: 1200,
            patientList: [
              {
                patientId: 'P-1001',
                name: 'Ramesh Kumar',
                billAmount: 500,
                discount: 200,
                finalPay: 300,
              },
              {
                patientId: 'P-1005',
                name: 'Anil Varma',
                billAmount: 450,
                discount: 200,
                finalPay: 250,
              },
            ],
          },
          {
            campId: 'CAMP-003',
            campName: 'Health Drive – Utnoor',
            date: '2026-02-10',
            totalDiscountApplied: 800,
            patientList: [
              {
                patientId: 'P-3004',
                name: 'Zeenat Aman',
                billAmount: 600,
                discount: 200,
                finalPay: 400,
              },
            ],
          },
        ],
      },

      {
        discountValue: 150,
        label: 'Senior Citizen Discount',
        totalRedeemed: 3200,
        camps: [
          {
            campId: 'CAMP-010',
            campName: 'Senior Citizen Health Camp – Nellore',
            date: '2026-03-30',
            totalDiscountApplied: 900,
            patientList: [
              {
                patientId: 'P-9001',
                name: 'Subba Rao',
                billAmount: 700,
                discount: 150,
                finalPay: 550,
              },
              {
                patientId: 'P-9002',
                name: 'Lakshmi',
                billAmount: 600,
                discount: 150,
                finalPay: 450,
              },
            ],
          },
        ],
      },

      {
        discountValue: 100,
        label: 'Standard Discount',
        totalRedeemed: 2500,
        camps: [
          {
            campId: 'CAMP-002',
            campName: 'Eye Checkup Camp – Nirmal',
            date: '2026-01-15',
            totalDiscountApplied: 900,
            patientList: [
              {
                patientId: 'P-1003',
                name: 'Lakshmi',
                billAmount: 300,
                discount: 100,
                finalPay: 200,
              },
            ],
          },
        ],
      },

      {
        discountValue: 75,
        label: 'Women Wellness Discount',
        totalRedeemed: 1800,
        camps: [
          {
            campId: 'CAMP-009',
            campName: 'Women Wellness Camp – Guntur',
            date: '2026-03-25',
            totalDiscountApplied: 600,
            patientList: [
              {
                patientId: 'P-8001',
                name: 'Lakshmi',
                billAmount: 400,
                discount: 75,
                finalPay: 325,
              },
              {
                patientId: 'P-8002',
                name: 'Sravani',
                billAmount: 350,
                discount: 75,
                finalPay: 275,
              },
            ],
          },
        ],
      },

      {
        discountValue: 50,
        label: 'Follow-up Visit Discount',
        totalRedeemed: 1100,
        camps: [
          {
            campId: 'CAMP-005',
            campName: 'Rural Health Camp – Warangal',
            date: '2026-03-02',
            totalDiscountApplied: 300,
            patientList: [
              { patientId: 'P-4003', name: 'Suresh', billAmount: 250, discount: 50, finalPay: 200 },
            ],
          },
        ],
      },

      {
        discountValue: 125,
        label: 'Chronic Care Discount',
        totalRedeemed: 2100,
        camps: [
          {
            campId: 'CAMP-006',
            campName: 'Diabetes Screening Camp – Karimnagar',
            date: '2026-03-08',
            totalDiscountApplied: 750,
            patientList: [
              {
                patientId: 'P-5001',
                name: 'Anil Varma',
                billAmount: 500,
                discount: 125,
                finalPay: 375,
              },
              {
                patientId: 'P-5002',
                name: 'Sulochana',
                billAmount: 450,
                discount: 125,
                finalPay: 325,
              },
            ],
          },
        ],
      },

      {
        discountValue: 80,
        label: 'Urban Camp Discount',
        totalRedeemed: 1600,
        camps: [
          {
            campId: 'CAMP-011',
            campName: 'Urban Health Camp – Secunderabad',
            date: '2026-04-05',
            totalDiscountApplied: 400,
            patientList: [
              { patientId: 'P-10001', name: 'Arjun', billAmount: 300, discount: 80, finalPay: 220 },
            ],
          },
        ],
      },

      {
        discountValue: 60,
        label: 'Village Outreach Discount',
        totalRedeemed: 1400,
        camps: [
          {
            campId: 'CAMP-012',
            campName: 'Village Health Camp – Suryapet',
            date: '2026-04-10',
            totalDiscountApplied: 300,
            patientList: [
              {
                patientId: 'P-11001',
                name: 'Shankar',
                billAmount: 260,
                discount: 60,
                finalPay: 200,
              },
            ],
          },
        ],
      },

      {
        discountValue: 90,
        label: 'Eye Care Discount',
        totalRedeemed: 1700,
        camps: [
          {
            campId: 'CAMP-013',
            campName: 'Eye & ENT Camp – Ongole',
            date: '2026-04-15',
            totalDiscountApplied: 450,
            patientList: [
              {
                patientId: 'P-12001',
                name: 'Rukmini',
                billAmount: 350,
                discount: 90,
                finalPay: 260,
              },
            ],
          },
        ],
      },

      {
        discountValue: 110,
        label: 'Orthopedic Support Discount',
        totalRedeemed: 1900,
        camps: [
          {
            campId: 'CAMP-014',
            campName: 'Bone & Joint Camp – Kurnool',
            date: '2026-04-20',
            totalDiscountApplied: 550,
            patientList: [
              {
                patientId: 'P-13001',
                name: 'Ranga Rao',
                billAmount: 500,
                discount: 110,
                finalPay: 390,
              },
            ],
          },
        ],
      },

      {
        discountValue: 70,
        label: 'Respiratory Care Discount',
        totalRedeemed: 1500,
        camps: [
          {
            campId: 'CAMP-008',
            campName: 'Respiratory Care Camp – Adilabad',
            date: '2026-03-20',
            totalDiscountApplied: 350,
            patientList: [
              {
                patientId: 'P-7001',
                name: 'Rahim Khan',
                billAmount: 300,
                discount: 70,
                finalPay: 230,
              },
            ],
          },
        ],
      },

      {
        discountValue: 95,
        label: 'Heart Care Discount',
        totalRedeemed: 1800,
        camps: [
          {
            campId: 'CAMP-007',
            campName: 'Heart Care Camp – Warangal',
            date: '2026-03-15',
            totalDiscountApplied: 600,
            patientList: [
              {
                patientId: 'P-6001',
                name: 'Krishna',
                billAmount: 450,
                discount: 95,
                finalPay: 355,
              },
            ],
          },
        ],
      },

      {
        discountValue: 40,
        label: 'General OPD Discount',
        totalRedeemed: 900,
        camps: [
          {
            campId: 'CAMP-015',
            campName: 'General Health Camp – Vizag',
            date: '2026-04-25',
            totalDiscountApplied: 200,
            patientList: [
              {
                patientId: 'P-14003',
                name: 'Naresh',
                billAmount: 240,
                discount: 40,
                finalPay: 200,
              },
            ],
          },
        ],
      },

      {
        discountValue: 30,
        label: 'Minimal Discount',
        totalRedeemed: 600,
        camps: [
          {
            campId: 'CAMP-004',
            campName: 'Free Medical Camp – Hyderabad',
            date: '2026-02-20',
            totalDiscountApplied: 150,
            patientList: [
              { patientId: 'P-3003', name: 'Imran', billAmount: 180, discount: 30, finalPay: 150 },
            ],
          },
        ],
      },

      {
        discountValue: 20,
        label: 'Promotional Discount',
        totalRedeemed: 400,
        camps: [
          {
            campId: 'CAMP-003',
            campName: 'Free Medical Camp – Vijayawada',
            date: '2026-02-05',
            totalDiscountApplied: 100,
            patientList: [
              { patientId: 'P-2003', name: 'Harish', billAmount: 150, discount: 20, finalPay: 130 },
            ],
          },
        ],
      },

      {
        discountValue: 0,
        label: 'Full Payment (No Discount)',
        totalRedeemed: 0,
        camps: [
          {
            campId: 'CAMP-004',
            campName: 'Rehab Camp – Nirmal',
            date: '2026-03-01',
            totalDiscountApplied: 0,
            patientList: [
              {
                patientId: 'P-6001',
                name: 'Venkat Rao',
                billAmount: 1000,
                discount: 0,
                finalPay: 1000,
              },
            ],
          },
        ],
      },
    ];
  }

  onSearch() {
    console.log('Searching for:', this.searchText());
    // Filter logic goes here
  }
}
