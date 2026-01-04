import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

type CampRunStatus = 'PLANNED' | 'STARTED' | 'CLOSED' | 'CANCELLED';

interface CampRun {
  camp_run_id?: number;
  camp_id: number;
  location_version_id: number;
  plan_id?: number;
  planned_date: Date;
  actual_date?: Date;
  status: CampRunStatus;
  started_by?: number;
  created_at?: Date;
  camp_name?: string;
  location_name?: string;
}

@Component({
  selector: 'app-camp-runs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    CardModule
  ],
  templateUrl: './camp-runs.component.html',
  styleUrl: './camp-runs.component.scss'
})
export class CampRunsComponent implements OnInit {
  campRuns: CampRun[] = [];
  filteredCampRuns: CampRun[] = [];
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  searchText: string = '';

  statuses: CampRunStatus[] = ['PLANNED', 'STARTED', 'CLOSED', 'CANCELLED'];
  camps = [{ camp_id: 1, camp_name: 'General Health Camp' }, { camp_id: 2, camp_name: 'Diabetes Screening Camp' }];
  locations = [{ location_version_id: 1, location_name: 'Main Hall' }, { location_version_id: 2, location_name: 'Community Center' }];

  campRunForm: CampRun = {
    camp_id: 0,
    location_version_id: 0,
    planned_date: new Date(),
    status: 'PLANNED'
  };

  ngOnInit() {
    this.loadCampRuns();
  }

  loadCampRuns() {
    this.campRuns = [
      { 
        camp_run_id: 1, 
        camp_id: 1, 
        location_version_id: 1, 
        planned_date: new Date('2024-02-01'), 
        actual_date: new Date('2024-02-01'),
        status: 'CLOSED',
        camp_name: 'General Health Camp',
        location_name: 'Main Hall',
        created_at: new Date('2024-01-15')
      },
      { 
        camp_run_id: 2, 
        camp_id: 1, 
        location_version_id: 1, 
        planned_date: new Date('2024-02-15'), 
        status: 'PLANNED',
        camp_name: 'General Health Camp',
        location_name: 'Main Hall',
        created_at: new Date('2024-01-20')
      }
    ];
    this.filteredCampRuns = [...this.campRuns];
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredCampRuns = [...this.campRuns];
      return;
    }
    this.filteredCampRuns = this.campRuns.filter(run =>
      run.camp_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      run.location_name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openNew() {
    this.campRunForm = {
      camp_id: 0,
      location_version_id: 0,
      planned_date: new Date(),
      status: 'PLANNED'
    };
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editRun(run: CampRun) {
    this.campRunForm = { ...run };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  saveRun() {
    if (this.isEditMode && this.campRunForm.camp_run_id) {
      const index = this.campRuns.findIndex(r => r.camp_run_id === this.campRunForm.camp_run_id);
      if (index !== -1) {
        this.campRuns[index] = { ...this.campRunForm };
      }
    } else {
      const newId = Math.max(...this.campRuns.map(r => r.camp_run_id || 0)) + 1;
      this.campRuns.push({
        ...this.campRunForm,
        camp_run_id: newId,
        created_at: new Date()
      });
    }
    this.filteredCampRuns = [...this.campRuns];
    this.displayDialog = false;
  }

  getStatusSeverity(status: CampRunStatus) {
    switch (status) {
      case 'PLANNED': return 'info';
      case 'STARTED': return 'warning';
      case 'CLOSED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return null;
    }
  }
}

