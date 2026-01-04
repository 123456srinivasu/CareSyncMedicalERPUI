import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  revenueData: any;
  revenueOptions: any;
  departmentData: any;
  departmentOptions: any;
  reportType: string = 'monthly';
  reportTypeOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ];

  ngOnInit() {
    // Revenue Chart
    this.revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue',
          data: [65000, 59000, 80000, 81000, 56000, 55000, 72000, 68000, 85000, 79000, 92000, 88000],
          fill: true,
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: '#667eea',
          tension: 0.4
        }
      ]
    };

    this.revenueOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return '$' + value / 1000 + 'K';
            }
          }
        }
      }
    };

    // Department Distribution
    this.departmentData = {
      labels: ['Cardiology', 'Pediatrics', 'Dermatology', 'Emergency', 'Orthopedics', 'Other'],
      datasets: [
        {
          data: [25, 20, 15, 18, 12, 10],
          backgroundColor: [
            '#667eea',
            '#48bb78',
            '#ed8936',
            '#4299e1',
            '#9f7aea',
            '#f56565'
          ]
        }
      ]
    };

    this.departmentOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    };
  }

  exportReport() {
    // In a real application, this would generate and download a report
    console.log('Exporting report...');
  }
}

