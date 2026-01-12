import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = [
    { title: 'Total Patients', value: '1,234', icon: 'people', color: '#667eea' },
    { title: 'Today Appointments', value: '45', icon: 'event', color: '#48bb78' },
    { title: 'Active Staff', value: '28', icon: 'badge', color: '#ed8936' },
    { title: 'Revenue (MTD)', value: '$125K', icon: 'attach_money', color: '#4299e1' }
  ];

  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Patients',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: '#667eea',
          tension: 0.4
        },
        {
          label: 'Appointments',
          data: [28, 48, 40, 19, 86, 27],
          fill: false,
          borderColor: '#48bb78',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }
}

