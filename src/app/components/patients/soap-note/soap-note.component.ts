import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { PatientService } from '../../../core/services/patient.service';

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
}
