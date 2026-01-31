import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { PatientService } from '../../../core/services/patient.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-soap-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    CardModule,
    ToastModule,
    TabViewModule,
  ],
  templateUrl: './soap-note.component.html',
  styleUrl: './soap-note.component.scss',
  providers: [MessageService],
})
export class SoapNoteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    Chart.register(...registerables);
  }
  private patientService = inject(PatientService);
  private messageService = inject(MessageService);

  activeTab = signal<string>('Subject');

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  patientId: number | null = null;
  patient: any = null;
  loading: boolean = false;

  // SOAP Form Data
  soapData: any = {
    chief_complaint: '',
    hpi: '',
    pmh: '',
    family_social: '',
    soap_body_subjective: '',

    bp: '',
    test_hr: null,
    rr: null,
    temp: '',
    spo2: '',

    general_appearance: '',
    heent: '',
    neck: '',
    cardio: '',
    respiratory: '',
    other_exam: '',

    diagnostic_tests: '',
    soap_body_objective: '',

    assessment_body: '',
    primary_dx: '',
    diff_dx: '',
    justification: '',

    medications: '',
    lifestyle: '',
    plan_body: '',

    // Checkbox boolean states
    frequent_infections: false,
    frequent_infections_skin: false,
    frequent_infections_gum: false,
    frequent_infections_vaginal: false,

    feeling_tired_weak: false,
    feeling_tired: false,
    feeling_weak: false,
    feeling_both: false,

    darkened_skin: false,
    darkened_skin_neck: false,
    darkened_skin_armpits: false,

    presenting_complaints: false,
  };

  ngOnInit() {
    const state = history.state;
    if (state?.patient) {
      this.patient = state.patient.value || state.patient;
      console.log('Patient loaded from state:', this.patient);
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.patientId = +id;

        // Only load if we don't have the patient data or if the ID doesn't match
        const currentPatientId = this.patient?.tblPatientId || this.patient?.patient_id;
        if (!this.patient || currentPatientId !== this.patientId) {
          this.loadPatient(this.patientId);
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid Patient ID',
        });
        this.router.navigate(['/patients']);
      }
    });
  }

  loadPatient(id: number) {
    this.loading = true;
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading patient', err);
        // If we have patient data from state (even if partial), we might want to keep it or show error.
        // For now, standard error handling.
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load full patient data.',
        });
        this.loading = false;
      },
    });
  }

  calculateAge(dob?: string | Date): number {
    if (!dob) return 0;
    // Handle if dob is just a number (age) or a date string
    if (typeof dob === 'number') return dob;

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  calculateDOBToAge(dob?: string | Date): number {
    if (!dob) return 0;
    // Handle if dob is just a number (age) or a date string
    //if (typeof dob === 'number') return dob;

    const today = new Date();
    const birthDate = new Date(Number(dob), today.getMonth(), today.getDate());
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    console.log('Calculated age from DOB:', age);
    return age;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('SOAP Form Submitted', this.soapData);
      // Here you would typically call a service to save the SOAP note
      // this.patientService.saveSoapNote(this.patientId, this.soapData).subscribe(...)

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'SOAP data submitted successfully!',
      });
      // Optional: Redirect back or clear form
      // this.router.navigate(['/patients']);
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields.',
      });
    }
  }

  onCancel() {
    this.router.navigate(['/patients']);
  }

  chart: any;
  diabetesChart: any;

  @ViewChild('myChart') set chartEl(el: ElementRef<HTMLCanvasElement>) {
    if (el) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.initChart(el.nativeElement);
    }
  }

  @ViewChild('diabetesChart') set diabetesChartEl(el: ElementRef<HTMLCanvasElement>) {
    if (el) {
      if (this.diabetesChart) {
        this.diabetesChart.destroy();
      }
      this.initDiabetesChart(el.nativeElement);
    }
  }

  initChart(canvas: HTMLCanvasElement) {
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['10/09/25', '12/09/25', '14/09/25', '01/10/25'],
        datasets: [
          {
            label: 'Systolic (mmHg)',
            data: [135, 145, 156, 120],
            borderColor: '#1f4e79',
            backgroundColor: '#1f4e79',
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 6,
            fill: false,
          },
          {
            label: 'Diastolic (mmHg)',
            data: [80, 85, 90, 80],
            borderColor: '#e67e22',
            backgroundColor: '#e67e22',
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 6,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              display: true,
            },
          },
          x: {
            grid: {
              display: true,
            },
          },
        },
      },
    });
  }

  initDiabetesChart(canvas: HTMLCanvasElement) {
    this.diabetesChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['11/09/25', '15/09/2025', '22/09/2025', '25/10/2025', '27/10/2025', '30/10/2025'],
        datasets: [
          {
            label: 'Systolic (mmHg)',
            data: [125, 99, 145, 120, 130, 85],
            borderColor: '#1f4e79',
            backgroundColor: '#1f4e79',
            tension: 0.3,
            pointRadius: 5,
            fill: false,
          },
          {
            label: 'Diastolic (mmHg)',
            data: [224, 228, 178, 145, 230, 178],
            borderColor: '#e67e22',
            backgroundColor: '#e67e22',
            tension: 0.3,
            pointRadius: 5,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              display: true,
            },
          },
          x: {
            grid: {
              display: true,
            },
          },
        },
      },
    });
  }
}
