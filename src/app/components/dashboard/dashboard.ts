// src/app/dashboard/dashboard.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/service/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  auth = inject(AuthService);
}
