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

  activeTab = signal<string>('Patient');

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
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.patientId = +id;
        this.loadPatient(this.patientId);
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patient data.',
        });
        this.loading = false;
        // In a real app, maybe redirect back or show a dedicated error state
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
