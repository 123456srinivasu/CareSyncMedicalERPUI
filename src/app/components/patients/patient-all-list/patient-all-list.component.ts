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
        age: 55,
        campsAttended: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            diagnosis: 'Diabetes',
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
          {
            campId: 'CAMP-003',
            campName: 'General Wellness – Adilabad',
            date: '2026-02-20',
            diagnosis: 'Hypertension',
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
        patientId: 'P-1002',
        name: 'Sita Devi',
        age: 38,
        campsAttended: [
          {
            campId: 'CAMP-001',
            campName: 'Free Medical Camp – Adilabad',
            date: '2026-01-12',
            diagnosis: 'Viral Fever',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Paracetamol 650mg',
                dosage: '1-1-1',
                days: 5,
                quantity: 15,
              },
            ],
          },
          {
            campId: 'CAMP-004',
            campName: 'Post-Viral Followup – Adilabad',
            date: '2026-01-25',
            diagnosis: 'Weakness',
            medicines: [
              {
                medicineId: 4,
                medicineName: 'B-Complex Syrup',
                dosage: '0-0-1',
                days: 10,
                quantity: 1,
              },
            ],
          },
        ],
      },
      {
        patientId: 'P-1003',
        name: 'Lakshmi',
        age: 62,
        campsAttended: [
          {
            campId: 'CAMP-002',
            campName: 'Eye Checkup Camp – Nirmal',
            date: '2026-01-15',
            diagnosis: 'Vision Issue',
            medicines: [
              { medicineId: 1, medicineName: 'Eye Drops', dosage: '0-0-1', days: 10, quantity: 1 },
            ],
          },
          {
            campId: 'CAMP-005',
            campName: 'Eye Surgery Followup – Nirmal',
            date: '2026-03-01',
            diagnosis: 'Post-Op Recovery',
            medicines: [
              {
                medicineId: 5,
                medicineName: 'Antibiotic Eye Ointment',
                dosage: '1-0-1',
                days: 7,
                quantity: 1,
              },
            ],
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
              {
                medicineId: 2,
                medicineName: 'Calcium Tablet',
                dosage: '0-1-0',
                days: 15,
                quantity: 15,
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
                medicineId: 1,
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
        campId: 'CAMP-002',
        campName: 'Eye Checkup Camp – Nirmal',
        date: '2026-01-15',
        location: 'Nirmal',
        patients: [
          {
            patientId: 'P-1003',
            name: 'Lakshmi',
            age: 62,
            diagnosis: 'Vision Issue',
            medicines: [
              {
                medicineId: 1,
                medicineName: 'Eye Drops',
                dosage: '0-0-1',
                days: 10,
                quantity: 1,
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
            campName: 'Diabetes Outreach – Gudihatnoor',
            date: '2026-02-05',
            patientsUsing: [
              {
                patientId: 'P-3002',
                name: 'Suresh Raina',
                diagnosis: 'Pre-Diabetes',
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
    ];

    this.doctorsMaster = [
      {
        doctorId: 'D-001',
        doctorName: 'Dr. Anjali Sharma',
        specialization: 'General Physician',
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
                remarks: 'High Sodium intake',
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
                remarks: 'Requires Inhaler',
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
                vitals: 'Partially Paralyzed',
                remarks: 'Physiotherapy recommended',
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
