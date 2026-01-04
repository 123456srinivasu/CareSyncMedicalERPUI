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
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';

type VisitType = 'CAMP' | 'EMERGENCY';

interface Visit {
  visit_id?: number;
  patient_id: number;
  visit_type: VisitType;
  camp_run_id?: number;
  doctor_id: number;
  visit_date: Date;
  registered_by?: number;
  created_at?: Date;
  patient_name?: string;
  doctor_name?: string;
  camp_name?: string;
}

interface Consultation {
  consultation_id?: number;
  visit_id: number;
  diagnosis_notes?: string;
  height?: number;
  weight?: string;
  systolic_bp?: string;
  pulse_rate?: string;
  bmi?: string;
  created_at?: Date;
}

@Component({
  selector: 'app-visits',
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
    CardModule,
    TabViewModule,
    InputTextModule,
    InputTextarea
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss'
})
export class VisitsComponent implements OnInit {
  visits: Visit[] = [];
  consultations: Consultation[] = [];
  filteredVisits: Visit[] = [];
  displayVisitDialog: boolean = false;
  displayConsultationDialog: boolean = false;
  isEditMode: boolean = false;
  searchText: string = '';
  selectedVisit: Visit | null = null;

  visitTypes: any[] = [
    { label: 'CAMP', value: 'CAMP' },
    { label: 'EMERGENCY', value: 'EMERGENCY' }
  ];
  patients = [
    { patient_id: 1, first_name: 'John', last_name: 'Doe', label: 'John Doe' },
    { patient_id: 2, first_name: 'Jane', last_name: 'Smith', label: 'Jane Smith' }
  ];
  doctors = [
    { user_id: 1, user_name: 'Dr. Sarah Johnson' },
    { user_id: 2, user_name: 'Dr. Michael Chen' }
  ];
  campRuns = [
    { camp_run_id: 1, camp_name: 'General Health Camp - Feb 1' },
    { camp_run_id: 2, camp_name: 'Diabetes Camp - Feb 15' }
  ];

  visitForm: Visit = {
    patient_id: 0,
    visit_type: 'CAMP',
    doctor_id: 0,
    visit_date: new Date()
  };

  consultationForm: Consultation = {
    visit_id: 0,
    diagnosis_notes: '',
    height: undefined,
    weight: '',
    systolic_bp: '',
    pulse_rate: '',
    bmi: ''
  };

  ngOnInit() {
    this.loadVisits();
  }

  loadVisits() {
    this.visits = [
      {
        visit_id: 1,
        patient_id: 1,
        visit_type: 'CAMP',
        camp_run_id: 1,
        doctor_id: 1,
        visit_date: new Date('2024-02-01'),
        patient_name: 'John Doe',
        doctor_name: 'Dr. Sarah Johnson',
        camp_name: 'General Health Camp',
        created_at: new Date('2024-02-01')
      }
    ];
    this.filteredVisits = [...this.visits];
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredVisits = [...this.visits];
      return;
    }
    this.filteredVisits = this.visits.filter(visit =>
      visit.patient_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      visit.doctor_name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openNewVisit() {
    this.visitForm = {
      patient_id: 0,
      visit_type: 'CAMP',
      doctor_id: 0,
      visit_date: new Date()
    };
    this.isEditMode = false;
    this.displayVisitDialog = true;
  }

  openConsultation(visit: Visit) {
    this.selectedVisit = visit;
    const existing = this.consultations.find(c => c.visit_id === visit.visit_id);
    if (existing) {
      this.consultationForm = { ...existing };
    } else {
      this.consultationForm = {
        visit_id: visit.visit_id || 0,
        diagnosis_notes: '',
        height: undefined,
        weight: '',
        systolic_bp: '',
        pulse_rate: '',
        bmi: ''
      };
    }
    this.displayConsultationDialog = true;
  }

  saveVisit() {
    if (this.isEditMode && this.visitForm.visit_id) {
      const index = this.visits.findIndex(v => v.visit_id === this.visitForm.visit_id);
      if (index !== -1) {
        this.visits[index] = { ...this.visitForm };
      }
    } else {
      const newId = Math.max(...this.visits.map(v => v.visit_id || 0)) + 1;
      const patient = this.patients.find(p => p.patient_id === this.visitForm.patient_id);
      const doctor = this.doctors.find(d => d.user_id === this.visitForm.doctor_id);
      this.visits.push({
        ...this.visitForm,
        visit_id: newId,
        patient_name: patient ? `${patient.first_name} ${patient.last_name}` : '',
        doctor_name: doctor?.user_name || '',
        created_at: new Date()
      });
    }
    this.filteredVisits = [...this.visits];
    this.displayVisitDialog = false;
  }

  saveConsultation() {
    if (this.consultationForm.consultation_id) {
      const index = this.consultations.findIndex(c => c.consultation_id === this.consultationForm.consultation_id);
      if (index !== -1) {
        this.consultations[index] = { ...this.consultationForm };
      }
    } else {
      const newId = Math.max(...this.consultations.map(c => c.consultation_id || 0)) + 1;
      this.consultations.push({
        ...this.consultationForm,
        consultation_id: newId,
        created_at: new Date()
      });
    }
    this.displayConsultationDialog = false;
  }

  getVisitTypeSeverity(type: VisitType) {
    return type === 'CAMP' ? 'success' : 'warning';
  }
}

