import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';

interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    CardModule,
    ChipModule
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
  staff: Staff[] = [];

  ngOnInit() {
    this.staff = [
      { id: 'S001', name: 'Dr. Sarah Johnson', role: 'Doctor', department: 'Cardiology', email: 'sarah.j@hospital.com', phone: '+1 234-567-9001', status: 'Active', joinDate: '2020-01-15' },
      { id: 'S002', name: 'Dr. Michael Chen', role: 'Doctor', department: 'Pediatrics', email: 'michael.c@hospital.com', phone: '+1 234-567-9002', status: 'Active', joinDate: '2019-03-20' },
      { id: 'S003', name: 'Dr. Emily Davis', role: 'Doctor', department: 'Dermatology', email: 'emily.d@hospital.com', phone: '+1 234-567-9003', status: 'Active', joinDate: '2021-06-10' },
      { id: 'S004', name: 'Nurse Lisa Anderson', role: 'Nurse', department: 'Emergency', email: 'lisa.a@hospital.com', phone: '+1 234-567-9004', status: 'Active', joinDate: '2022-02-05' },
      { id: 'S005', name: 'Nurse Tom Wilson', role: 'Nurse', department: 'ICU', email: 'tom.w@hospital.com', phone: '+1 234-567-9005', status: 'On Leave', joinDate: '2021-11-18' },
      { id: 'S006', name: 'Dr. James Martinez', role: 'Doctor', department: 'Orthopedics', email: 'james.m@hospital.com', phone: '+1 234-567-9006', status: 'Active', joinDate: '2018-09-12' },
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Inactive':
        return 'danger';
      default:
        return null;
    }
  }

  getRoleColor(role: string) {
    return role === 'Doctor' ? '#667eea' : '#48bb78';
  }
}

