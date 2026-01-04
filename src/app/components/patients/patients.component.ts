import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

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
    DialogModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchText: string = '';

  ngOnInit() {
    // Sample data matching database schema
    this.patients = [
      { patient_id: 1, first_name: 'John', last_name: 'Doe', gender: 'MALE', dob: new Date('1979-01-15'), phone: '+1 234-567-8900', address: '123 Main St', created_at: new Date('2024-01-01') },
      { patient_id: 2, first_name: 'Jane', last_name: 'Smith', gender: 'FEMALE', dob: new Date('1992-05-20'), phone: '+1 234-567-8901', address: '456 Oak Ave', created_at: new Date('2024-01-02') },
      { patient_id: 3, first_name: 'Robert', last_name: 'Johnson', gender: 'MALE', dob: new Date('1966-08-10'), phone: '+1 234-567-8902', address: '789 Pine Rd', created_at: new Date('2023-12-15') },
      { patient_id: 4, first_name: 'Sarah', last_name: 'Williams', gender: 'FEMALE', dob: new Date('1996-03-25'), phone: '+1 234-567-8903', address: '321 Elm St', created_at: new Date('2024-01-10') },
      { patient_id: 5, first_name: 'Michael', last_name: 'Brown', gender: 'MALE', dob: new Date('1972-11-30'), phone: '+1 234-567-8904', address: '654 Maple Dr', created_at: new Date('2024-01-05') },
    ];
    this.filteredPatients = [...this.patients];
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter(patient =>
      patient.first_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      patient.last_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  calculateAge(dob?: Date): number {
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
}

