import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PatientService } from '../../core/services/patient.service';
import { MessageService } from 'primeng/api';
import { LocationsService } from '../../core/services/locations.service';

import { ToastModule } from 'primeng/toast';

interface Patient {
  patient_id?: number;
  first_name: string;
  last_name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dob?: Date;
  phone?: string;
  address?: string;
  created_at?: Date;
}

interface PatientRecord {
  photo?: string;
  first_name: string;
  father_name?: string;
  mr_number: string;
  city?: string;
  age?: number;
  gender?: string;
  phone?: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CardModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
  providers: [MessageService],
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchText: string = '';
  isExistingPatient: boolean = false;
  globalFilter: string = '';
  private readonly patientService = inject(PatientService);
  private readonly locationsService = inject(LocationsService);
  private readonly messageService = inject(MessageService);

  // Table-specific data for the new PrimeNG table
  patientTableData: PatientRecord[] = [];
  loading: boolean = false;

  // ... (rest of the file until onSubmit)

  onSubmit(form: any) {
    if (form.valid) {
      const payload = {
        firstName: this.newPatient.firstName,
        lastName: this.newPatient.lastName,
        fatherName: this.newPatient.fatherName,
        age: this.newPatient.age,
        weight: this.newPatient.weight,
        mobileNumber: this.newPatient.phoneNumber,
        gender: this.newPatient.gender,
        bloodGroup: this.newPatient.bloodGroup,
        maritalStatus: this.newPatient.maritalStatus,
        patientImage: [], // Empty for now as per instructions
        patientAddressesList: [
          {
            addressLine: this.newPatient.address.street,
            city: this.newPatient.address.city,
            stateId: this.newPatient.address.state,
            districtId: this.newPatient.address.district,
            mandalId: this.newPatient.address.mandal,
            postalCode: this.newPatient.address.postalCode,
            villageName: this.newPatient.address.city, // Assuming village is city for now
          },
        ],
      };

      this.loading = true;
      this.patientService.createPatient(payload).subscribe({
        next: (res) => {
          console.log('Patient created', res);
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient created successfully!',
          });
          this.onClearForm();
          // Reset the form state (pristine/untouched)
          form.resetForm();
          this.isExistingPatient = true;
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error creating patient', err);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create patient. Please try again.',
          });
        },
      });
    } else {
      // Mark all controls as touched to trigger validation messages
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
    }
  }

  defaultAvatar: string =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect fill="%23e6e6e6" width="100%" height="100%"/><circle cx="32" cy="22" r="14" fill="%23999"/><rect x="10" y="40" width="44" height="12" rx="6" fill="%23999"/></svg>';

  // Location Data
  states: any[] = [];
  districts: any[] = [];
  mandals: any[] = [];

  ngOnInit() {
    this.patients = [
      {
        patient_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        gender: 'MALE',
        dob: new Date('1979-01-15'),
        phone: '+1 234-567-8900',
        address: '123 Main St',
        created_at: new Date('2024-01-01'),
      },
      {
        patient_id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        gender: 'FEMALE',
        dob: new Date('1992-05-20'),
        phone: '+1 234-567-8901',
        address: '456 Oak Ave',
        created_at: new Date('2024-01-02'),
      },
      {
        patient_id: 3,
        first_name: 'Robert',
        last_name: 'Johnson',
        gender: 'MALE',
        dob: new Date('1966-08-10'),
        phone: '+1 234-567-8902',
        address: '789 Pine Rd',
        created_at: new Date('2023-12-15'),
      },
      {
        patient_id: 4,
        first_name: 'Sarah',
        last_name: 'Williams',
        gender: 'FEMALE',
        dob: new Date('1996-03-25'),
        phone: '+1 234-567-8903',
        address: '321 Elm St',
        created_at: new Date('2024-01-10'),
      },
      {
        patient_id: 5,
        first_name: 'Michael',
        last_name: 'Brown',
        gender: 'MALE',
        dob: new Date('1972-11-30'),
        phone: '+1 234-567-8904',
        address: '654 Maple Dr',
        created_at: new Date('2024-01-05'),
      },
    ];
    this.filteredPatients = [...this.patients];

    // Sample mock data for the PrimeNG table
    this.patientTableData = [
      {
        photo: '',
        first_name: 'John Doe',
        father_name: 'Michael Doe',
        mr_number: 'MR-1001',
        city: 'New York',
        age: 45,
        gender: 'Male',
        phone: '+1-234-567-8900',
      },
      {
        photo: '',
        first_name: 'Jane Smith',
        father_name: 'Robert Smith',
        mr_number: 'MR-1002',
        city: 'Los Angeles',
        age: 33,
        gender: 'Female',
        phone: '+1-234-567-8901',
      },
      {
        photo: '',
        first_name: 'Ravi Kumar',
        father_name: 'Suresh Kumar',
        mr_number: 'MR-1003',
        city: 'Hyderabad',
        age: 29,
        gender: 'Male',
        phone: '+91-98765-43210',
      },
      {
        photo: '',
        first_name: 'Aisha Khan',
        father_name: 'Imran Khan',
        mr_number: 'MR-1004',
        city: 'Mumbai',
        age: 38,
        gender: 'Female',
        phone: '+91-91234-56789',
      },
      {
        photo: '',
        first_name: 'Miguel Santos',
        father_name: 'Carlos Santos',
        mr_number: 'MR-1005',
        city: 'Manila',
        age: 52,
        gender: 'Male',
        phone: '+63-912-345-6789',
      },
      {
        photo: '',
        first_name: 'Fatima Ali',
        father_name: 'Ahmed Ali',
        mr_number: 'MR-1006',
        city: 'Karachi',
        age: 26,
        gender: 'Female',
        phone: '+92-300-1234567',
      },
    ];
    this.loadPatients();
    this.loadStates();
  }

  loadStates() {
    this.locationsService.getStates().subscribe({
      next: (data) => {
        this.states = data;
      },
      error: (err) => {
        console.error('Error loading states', err);
      },
    });
  }

  onStateChange() {
    this.districts = [];
    const selectedStateName = this.newPatient.address.state;
    if (!selectedStateName) return;

    const selectedState = this.states.find((s) => s.stateLookupId == selectedStateName);
    if (selectedState) {
      // Assuming 'stateId' based on 'stateName' pattern, falling back to 'id'
      const stateId = selectedState.stateLookupId || selectedState.id;
      if (stateId) {
        this.newPatient.address.district = '';
        this.newPatient.address.mandal = '';
        this.loadDistricts(stateId);
      }
    }
  }

  loadDistricts(stateId: number) {
    this.locationsService.getDistrictsByState(stateId).subscribe({
      next: (data) => {
        this.districts = data;
      },
      error: (err) => {
        console.error('Error loading districts', err);
      },
    });
  }

  onDistrictChange() {
    this.mandals = [];
    const selectedDistrictName = this.newPatient.address.district;
    if (!selectedDistrictName) return;

    const selectedDistrict = this.districts.find((d) => d.districtLookupId == selectedDistrictName);
    if (selectedDistrict) {
      // Assuming 'districtId' based on pattern, falling back to 'id'
      const districtId = selectedDistrict.districtLookupId || selectedDistrict.id;
      if (districtId) {
        this.newPatient.address.mandal = '';
        this.loadMandals(districtId);
      }
    }
  }

  loadMandals(districtId: number) {
    this.locationsService.getMandalsByDistrict(districtId).subscribe({
      next: (data) => {
        this.mandals = data;
      },
      error: (err) => {
        console.error('Error loading mandals', err);
      },
    });
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patientTableData = this.mapToPatientRecords(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients', error);
        this.loading = false;
        // fallback to empty or show error
        this.patientTableData = [];
      },
    });
  }

  onSearch() {
    if (!this.searchText) {
      this.loadPatients();
      return;
    }

    this.loading = true;
    this.patientService.searchPatients(this.searchText).subscribe({
      next: (data) => {
        this.patientTableData = this.mapToPatientRecords(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching patients', error);
        this.loading = false;
        this.patientTableData = [];
      },
    });
  }

  private mapToPatientRecords(data: any[]): PatientRecord[] {
    if (!Array.isArray(data)) return [];

    return data.map((p) => ({
      photo: '', // No photo in API yet
      first_name: p.firstName + (p.lastName ? ' ' + p.lastName : ''), // Combine names for display
      father_name: '', // Not in basic API response yet
      mr_number: p.patientId ? `MR-${p.patientId}` : '', // Generate/Map MR number
      city: p.address || '',
      age: this.calculateAge(p.dob),
      gender: p.gender || '',
      phone: p.phoneNumber || '',
    }));
  }

  onView(record: PatientRecord) {
    console.log('View', record);
  }

  onEdit(record: PatientRecord) {
    console.log('Edit', record);
  }

  onDelete(record: PatientRecord) {
    console.log('Delete', record);
    if (record.mr_number) {
      // Extract ID from MR Number or store real ID in record hidden field
      // For now, just log
    }
  }

  // Create Patient Form Data
  newPatient: any = {
    firstName: '',
    lastName: '',
    fatherName: '',
    age: null,
    weight: null,
    phoneNumber: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    address: {
      street: '',
      city: '',
      mandal: '',
      district: '',
      state: '',
    },
    // SOAP notes related fields can be added here if needed for creation
  };

  /* onSubmit(form: any) {
    if (form.valid) {
      const payload = {
        tblPatientId: 0,
        mrNumber: '', // Backend usually generates this or expects empty string on creation
        firstName: this.newPatient.firstName,
        lastName: this.newPatient.lastName,
        fatherName: this.newPatient.fatherName,
        age: this.newPatient.age,
        weight: this.newPatient.weight,
        mobileNumber: this.newPatient.phoneNumber,
        gender: this.newPatient.gender,
        bloodGroup: this.newPatient.bloodGroup,
        maritalStatus: this.newPatient.maritalStatus,
        patientImage: [], // Empty for now as per instructions
        patientAddressesList: [
          {
            addressId: 0,
            addressLine: this.newPatient.address.street,
            city: this.newPatient.address.city,
            stateId: 0,
            districtId: 0,
            mandalId: 0,
            postalCode: '', // Not in form
            villageName: this.newPatient.address.city, // Assuming village is city for now
            state: {
              id: 0,
              name: this.newPatient.address.state,
            },
            district: {
              id: 0,
              name: this.newPatient.address.district,
            },
            mandal: {
              id: 0,
              name: this.newPatient.address.mandal,
            },
          },
        ],
      };

      this.loading = true;
      this.patientService.createPatient(payload).subscribe({
        next: (res) => {
          console.log('Patient created', res);
          this.loading = false;
          alert('Patient created successfully!');
          this.onClearForm();
          // Reset the form state (pristine/untouched)
          form.resetForm();
          this.isExistingPatient = true;
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error creating patient', err);
          this.loading = false;
          alert('Failed to create patient. Please try again.');
        },
      });
    } else {
      // Mark all controls as touched to trigger validation messages
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
    }
  } */

  onClearForm() {
    this.newPatient = {
      firstName: '',
      lastName: '',
      fatherName: '',
      age: null,
      weight: null,
      phoneNumber: '',
      gender: '',
      bloodGroup: '',
      maritalStatus: '',
      address: {
        street: '',
        city: '',
        mandal: '',
        district: '',
        state: '',
      },
    };
  }

  calculateAge(dob?: string | Date): number {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onReset(form: any) {
    form.resetForm();
    this.onClearForm();
  }
}
