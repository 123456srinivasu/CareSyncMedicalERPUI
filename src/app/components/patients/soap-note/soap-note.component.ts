import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { PatientService } from '../../../core/services/patient.service';
import { Chart, registerables } from 'chart.js';

// TypeScript Interfaces
interface QuestionOption {
  optionId: number;
  optionText: string;
  nextQuestionId: number | null;
}

interface Question {
  questionId: number;
  questionText: string;
  questionType: string;
  options?: QuestionOption[];
}

interface QuestionAnswer {
  questionId: number;
  selectedOptions?: number[];
  textValue?: string;
}

// Payload interfaces for submission
interface AnswerPayloadItem {
  questionId: number;
  optionId: number | null;
  answerText: string | null;
}

interface QuestionnaireSubmissionPayload {
  campId: number;
  patientId: number;
  answers: AnswerPayloadItem[];
}

@Component({
  selector: 'app-soap-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TabViewModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    InputTextarea,
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
  campId: number = 101; // TODO: Get from route params or service
  patient: any = null;
  loading: boolean = false;
  questionnaire: Question[] = [];
  questionnaireLoading: boolean = false;
  questionnaireForm!: FormGroup;
  visibleQuestions: Set<number> = new Set();
  answeredQuestions: Set<number> = new Set();
  currentQuestionIndex: number = 0;

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

    // Load questionnaire on page load
    this.loadQuestionnaire();

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

  loadQuestionnaire() {
    this.questionnaireLoading = true;
    this.patientService.getCampQuestions().subscribe({
      next: (data: Question[]) => {
        this.questionnaire = data;
        console.log('Questionnaire loaded:', this.questionnaire);
        this.initializeQuestionnaireForm();
        this.updateVisibleQuestions();
        this.questionnaireLoading = false;
      },
      error: (err) => {
        console.error('Error loading questionnaire', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load questionnaire data.',
        });
        this.questionnaireLoading = false;
      },
    });
  }

  /**
   * Initialize the reactive form for questionnaire
   */
  initializeQuestionnaireForm() {
    const formControls: { [key: string]: FormControl | FormArray<any> } = {};

    this.questionnaire.forEach((question) => {
      const normalizedType = this.normalizeQuestionType(question.questionType);

      if (normalizedType === 'MCQ') {
        // For MCQ, use FormArray to store multiple selected option IDs
        formControls[`question_${question.questionId}`] = new FormArray<any>([]);
      } else if (normalizedType === 'SCQ') {
        // For SCQ, use FormControl to store single option ID
        formControls[`question_${question.questionId}`] = new FormControl(null);
      } else if (normalizedType === 'TEXT') {
        // For TEXT, use FormControl to store text value
        formControls[`question_${question.questionId}`] = new FormControl('');
      }
    });

    this.questionnaireForm = new FormGroup(formControls);
  }

  /**
   * Normalize question type by trimming whitespace and converting to uppercase
   */
  normalizeQuestionType(type: string): string {
    return type.trim().toUpperCase();
  }

  /**
   * Update visible questions - shows all questions at once
   */
  updateVisibleQuestions() {
    this.visibleQuestions.clear();

    if (this.questionnaire.length === 0) return;

    // Show all questions
    this.questionnaire.forEach(question => {
      this.visibleQuestions.add(question.questionId);
    });
  }

  /**
   * Handle answer change for any question
   */
  onAnswerChange(questionId: number) {
    this.updateVisibleQuestions();
  }

  /**
   * Check if a question should be readonly
   * Always returns false - users can change answers anytime
   */
  isQuestionReadonly(questionId: number): boolean {
    return false;
  }

  /**
   * Check if this is the last visible question
   */
  isLastVisibleQuestion(questionId: number): boolean {
    const visibleArray = Array.from(this.visibleQuestions);
    return visibleArray[visibleArray.length - 1] === questionId;
  }

  /**
   * Get visible questions in order
   */
  getVisibleQuestionsInOrder(): Question[] {
    return this.questionnaire.filter(q => this.visibleQuestions.has(q.questionId));
  }

  /**
   * Handle MCQ checkbox change
   */
  onMCQChange(questionId: number, optionId: number, checked: boolean) {
    const formArray = this.questionnaireForm.get(`question_${questionId}`) as FormArray;

    if (checked) {
      formArray.push(new FormControl(optionId));
    } else {
      const index = formArray.controls.findIndex(ctrl => ctrl.value === optionId);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    }

    this.onAnswerChange(questionId);
  }

  /**
   * Check if an MCQ option is selected
   */
  isMCQOptionSelected(questionId: number, optionId: number): boolean {
    const formArray = this.questionnaireForm?.get(
      `question_${questionId}`,
    ) as FormArray<any>;
    return formArray ? formArray.value.includes(optionId) : false;
  }

  /**
   * Get FormControl for a question (helper for template type safety)
   */
  getQuestionFormControl(questionId: number): FormControl {
    return this.questionnaireForm.get(`question_${questionId}`) as FormControl;
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

  /**
   * Prepare questionnaire data for submission
   * Transforms form data into the required database payload format
   */
  prepareQuestionnairePayload(): QuestionnaireSubmissionPayload {
    const answers: AnswerPayloadItem[] = [];

    // Iterate through all questions in the questionnaire
    this.questionnaire.forEach((question) => {
      const formControlName = `question_${question.questionId}`;
      const formValue = this.questionnaireForm?.get(formControlName)?.value;
      const normalizedType = this.normalizeQuestionType(question.questionType);

      // Skip if no answer provided
      if (!formValue || (Array.isArray(formValue) && formValue.length === 0) || formValue === '') {
        return; // Continue to next question
      }

      if (normalizedType === 'MCQ') {
        // MCQ: Create one answer object per selected option
        const selectedOptions = formValue as number[];
        selectedOptions.forEach((optionId) => {
          answers.push({
            questionId: question.questionId,
            optionId: optionId,
            answerText: null,
          });
        });
      } else if (normalizedType === 'SCQ') {
        // SCQ: Create one answer object with selected optionId
        answers.push({
          questionId: question.questionId,
          optionId: formValue as number,
          answerText: null,
        });
      } else if (normalizedType === 'TEXT') {
        // TEXT: Create one answer object with answerText and optionId = null
        answers.push({
          questionId: question.questionId,
          optionId: null,
          answerText: formValue as string,
        });
      }
    });

    return {
      campId: this.campId,
      patientId: this.patientId!,
      answers: answers,
    };
  }

  /**
   * Save questionnaire answers
   */
  onSaveSubjective() {
    if (!this.patientId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Patient ID is missing',
      });
      return;
    }

    // Prepare the payload
    const payload = this.prepareQuestionnairePayload();

    // Log the payload for debugging
    console.log('Questionnaire Submission Payload:', JSON.stringify(payload, null, 2));

    // TODO: Call the API service to submit the data
    // this.patientService.submitQuestionnaireAnswers(payload).subscribe({
    //   next: (response) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Questionnaire answers saved successfully!',
    //     });
    //   },
    //   error: (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to save questionnaire answers',
    //     });
    //     console.error('Error saving questionnaire:', error);
    //   }
    // });

    // For now, show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Questionnaire saved with ${payload.answers.length} answers. Check console for payload.`,
    });
  }

  /**
   * Cancel questionnaire and reset form
   */
  onCancelSubjective() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.questionnaireForm.reset();
      this.visibleQuestions.clear();
      this.answeredQuestions.clear();
      this.updateVisibleQuestions();

      this.messageService.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Questionnaire has been reset',
      });
    }
  }
}
