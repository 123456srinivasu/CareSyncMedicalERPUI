import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    CalendarModule,
    CardModule,
    TabViewModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  todayAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];

  ngOnInit() {
    this.appointments = [
      { id: 'A001', patientName: 'John Doe', doctor: 'Dr. Sarah Johnson', date: '2024-01-20', time: '10:00 AM', type: 'Consultation', status: 'Scheduled' },
      { id: 'A002', patientName: 'Jane Smith', doctor: 'Dr. Michael Chen', date: '2024-01-20', time: '11:30 AM', type: 'Follow-up', status: 'Scheduled' },
      { id: 'A003', patientName: 'Robert Johnson', doctor: 'Dr. Emily Davis', date: '2024-01-21', time: '02:00 PM', type: 'Check-up', status: 'Scheduled' },
      { id: 'A004', patientName: 'Sarah Williams', doctor: 'Dr. Sarah Johnson', date: '2024-01-22', time: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
      { id: 'A005', patientName: 'Michael Brown', doctor: 'Dr. Michael Chen', date: '2024-01-19', time: '03:30 PM', type: 'Follow-up', status: 'Completed' },
    ];

    const today = new Date().toISOString().split('T')[0];
    this.todayAppointments = this.appointments.filter(apt => apt.date === today);
    this.upcomingAppointments = this.appointments.filter(apt => apt.date > today);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Scheduled':
        return 'info';
      case 'Confirmed':
        return 'success';
      case 'Completed':
        return null;
      case 'Cancelled':
        return 'danger';
      default:
        return null;
    }
  }
}

