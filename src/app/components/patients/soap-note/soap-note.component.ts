// soap-note.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
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

// ===== Interfaces =====
interface QuestionOption {
  optionId: number;
  optionText: string;
  nextQuestionId: number | null;
}

interface Question {
  questionId: number;
  questionText: string;
  questionType: string;
  questionsCategory: string;
  defaultDisplay: 'show' | 'hide';
  options: QuestionOption[];
}

interface AnswerPayloadItem {
  questionId: number;
  optionId: number | null;
  answerText: string | null;
}

interface QuestionnaireSubmissionPayload {
  campId: number;
  patientId: any;
  answers: AnswerPayloadItem[];
}

interface Vital {
  vitalId: number;
  vitalName: string;
  referenceRange: string;
  description: string;
  isActive: boolean;
  value?: string | number;

  // UI helpers
  icon?: string;
  iconClass?: string;
  unit?: string;
}

interface LabTest {
  id: number | null;
  labTestName: string | null;
  description: string | null;
  isActive: boolean | null;
}

interface VitalSaveItem {
  vitalLookupId: number;
  measurementType: string;
  vitalValue: string;
}

interface LabTestSaveItem {
  labTestLookupId: number;
  labTestDate: string;
  testWithMedicineS: string;
  testResultValue: string;
  testResultUnit: string;
  referenceValue: string;
  remark: string;
}

interface ObjectiveSavePayload {
  patientId: number;
  patientVisitId: number;
  labTests: LabTestSaveItem[];
  vitals: VitalSaveItem[];
}

// ===== Labs UI Model =====
interface LabEntryRow {
  labTestDate: string;
  testWithMedicineS: 'Yes' | 'No' | '';
  testResultValue: string;
  testResultUnit: string;
  referenceValue: string;
  remark: string;
}

interface LabGroup {
  labTestLookupId: number;
  labTestName: string;
  entries: LabEntryRow[];
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
  private patientService = inject(PatientService);
  private messageService = inject(MessageService);

  // Tabs
  activeTab = signal<string>('Subject');
  setActiveTab(tab: string) {
    this.activeTab.set(tab);
    if (tab === 'Objective') this.loadObjectiveDataOnce();
  }

  patientId: number | null = null;
  campId: number = 1;
  patient: any = null;

  // Questionnaire
  questionnaire: Question[] = [];
  questionnaireLoading = false;
  questionnaireForm!: FormGroup;

  visibleQuestions: Set<number> = new Set();
  private questionMap = new Map<number, Question>();
  expandedQuestionMap: Record<number, boolean> = {};

  // Objective
  vitalsLoading = false;
  labsLoading = false;
  vitalsList: Vital[] = [];
  labsList: LabTest[] = [];
  labGroups: LabGroup[] = [];

  private objectiveLoaded = false;
  private readonly DEFAULT_LABS_COUNT = 10;

  ngOnInit() {
    const state = history.state;
    if (state?.patient) {
      this.patient = state.patient.value || state.patient;
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.patientId = +id;
    });

    this.loadQuestionnaire();
  }

  // ===================== Questionnaire Load =====================
  loadQuestionnaire() {
    this.questionnaireLoading = true;

    this.patientService.getCampQuestions().subscribe({
      next: (data: Question[]) => {
        this.questionnaire = data || [];
        this.buildQuestionMap();
        this.initializeQuestionnaireForm();
        this.initDefaultVisibleQuestions();
        this.questionnaireLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.questionnaireLoading = false;
      },
    });
  }

  private buildQuestionMap() {
    this.questionMap.clear();
    for (const q of this.questionnaire) this.questionMap.set(q.questionId, q);
  }

  private initDefaultVisibleQuestions() {
    this.visibleQuestions.clear();
    for (const q of this.questionnaire) {
      if (q.defaultDisplay === 'show') this.visibleQuestions.add(q.questionId);
    }
  }

  initializeQuestionnaireForm() {
    const controls: Record<string, AbstractControl> = {};

    for (const q of this.questionnaire) {
      const t = this.normalizeQuestionType(q.questionType);

      if (t === 'MCQ') controls[`question_${q.questionId}`] = new FormArray<FormControl<number>>([]);
      if (t === 'SCQ') controls[`question_${q.questionId}`] = new FormControl<number | null>(null);
      if (t === 'TEXT') controls[`question_${q.questionId}`] = new FormControl<string>('');
    }

    this.questionnaireForm = new FormGroup(controls);
  }

  normalizeQuestionType(type: string): string {
    return (type || '').trim().toUpperCase();
  }

  // ===================== Expand/Collapse =====================
  isQuestionExpanded(questionId: number): boolean {
    return !!this.expandedQuestionMap[questionId];
  }

  toggleQuestion(questionId: number, checked: boolean) {
    this.expandedQuestionMap[questionId] = checked;
  }

  // ===================== Category Helpers =====================
  getVisibleQuestionsInOrder(): Question[] {
    return this.questionnaire.filter((q) => this.visibleQuestions.has(q.questionId));
  }

  getVisibleQuestionsByCategory(category: string): Question[] {
    return this.getVisibleQuestionsInOrder().filter((q) => q.questionsCategory === category);
  }

  getNonGeneralCategoriesInOrder(): string[] {
    const set = new Set<string>();
    for (const q of this.questionnaire) {
      if (this.visibleQuestions.has(q.questionId) && q.questionsCategory !== 'generalquestions') {
        set.add(q.questionsCategory);
      }
    }
    return [...set];
  }

  // ===================== Form Helpers =====================
  getQuestionFormControl(questionId: number): FormControl {
    return this.questionnaireForm.get(`question_${questionId}`) as FormControl;
  }

  isQuestionReadonly(_questionId: number): boolean {
    return false;
  }

  // ===================== Branching =====================
  onMCQChange(questionId: number, optionId: number, checked: boolean) {
    const formArray = this.questionnaireForm.get(`question_${questionId}`) as FormArray<FormControl<number>>;

    if (checked) {
      // formArray.push(new FormControl<number>(optionId));
    } else {
      const idx = formArray.controls.findIndex((c) => c.value === optionId);
      if (idx >= 0) formArray.removeAt(idx);
    }

    const q = this.questionMap.get(questionId);
    const opt = q?.options?.find((o) => o.optionId === optionId);
    const nextId = opt?.nextQuestionId;

    if (!nextId) return;
    if (checked) this.showBranch(nextId);
    else this.hideBranch(nextId);
  }

  isMCQOptionSelected(questionId: number, optionId: number): boolean {
    const arr = this.questionnaireForm.get(`question_${questionId}`) as FormArray<FormControl<number>>;
    return (arr?.value || []).includes(optionId);
  }

  onSCQSelect(questionId: number) {
    const q = this.questionMap.get(questionId);
    if (!q) return;

    // hide all children first
    for (const opt of q.options || []) {
      if (opt.nextQuestionId) this.hideBranch(opt.nextQuestionId);
    }

    const selected = this.getQuestionFormControl(questionId).value as number | null;
    if (!selected) return;

    const selectedOpt = q.options.find((o) => o.optionId === selected);
    if (selectedOpt?.nextQuestionId) this.showBranch(selectedOpt.nextQuestionId);
  }

  private showBranch(questionId: number) {
    const q = this.questionMap.get(questionId);
    if (!q) return;
    this.visibleQuestions.add(questionId);
    this.expandedQuestionMap[questionId] = true;
    this.applyBranchingForQuestion(questionId);
  }

  private applyBranchingForQuestion(questionId: number) {
    const q = this.questionMap.get(questionId);
    if (!q) return;

    const type = this.normalizeQuestionType(q.questionType);
    const ctrl = this.questionnaireForm.get(`question_${questionId}`);
    if (!ctrl) return;

    if (type === 'SCQ') {
      const selected = ctrl.value as number | null;
      if (!selected) return;
      const opt = q.options?.find((o) => o.optionId === selected);
      if (opt?.nextQuestionId) this.showBranch(opt.nextQuestionId);
    }

    if (type === 'MCQ') {
      const selectedList = (ctrl.value as number[]) || [];
      for (const optionId of selectedList) {
        const opt = q.options?.find((o) => o.optionId === optionId);
        if (opt?.nextQuestionId) this.showBranch(opt.nextQuestionId);
      }
    }
  }

  hideBranch(questionId: number) {
    const q = this.questionMap.get(questionId);
    if (!q) return;

    this.visibleQuestions.delete(questionId);
    this.expandedQuestionMap[questionId] = false;

    const ctrl = this.questionnaireForm.get(`question_${questionId}`);
    if (ctrl instanceof FormArray) ctrl.clear();
    else ctrl?.reset();

    for (const opt of q.options || []) {
      if (opt.nextQuestionId) this.hideBranch(opt.nextQuestionId);
    }
  }

  // ===================== Save Subjective =====================
  prepareQuestionnairePayload(): QuestionnaireSubmissionPayload {
    const answers: AnswerPayloadItem[] = [];

    for (const q of this.questionnaire) {
      if (!this.visibleQuestions.has(q.questionId)) continue;

      const name = `question_${q.questionId}`;
      const val = this.questionnaireForm.get(name)?.value;
      const t = this.normalizeQuestionType(q.questionType);

      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) continue;

      const getOptionText = (optionId: number) =>
        q.options?.find((o) => o.optionId === optionId)?.optionText ?? String(optionId);

      if (t === 'MCQ') {
        (val as number[]).forEach((optId) => {
          answers.push({ questionId: q.questionId, optionId: optId, answerText: getOptionText(optId) });
        });
      } else if (t === 'SCQ') {
        const optId = val as number;
        answers.push({ questionId: q.questionId, optionId: optId, answerText: getOptionText(optId) });
      } else {
        answers.push({ questionId: q.questionId, optionId: null, answerText: val as string });
      }
    }

    return { campId: this.campId, patientId: this.patientId ?? 0, answers };
  }

  onSaveSubjective() {
    if (!this.patientId) return;

    const payload = this.prepareQuestionnairePayload();

    this.patientService.submitQuestionnaireAnswers(payload).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: res?.message || 'Patient answers saved successfully',
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save answers' });
      },
    });
  }

  onCancelSubjective() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.questionnaireForm.reset();
      this.visibleQuestions.clear();
      this.expandedQuestionMap = {};
      this.initDefaultVisibleQuestions();
    }
  }

  // ===================== Objective Load (only once) =====================
  private loadObjectiveDataOnce() {
    if (this.objectiveLoaded) return;
    this.objectiveLoaded = true;

    this.loadVitals();
    this.loadLabs();
  }

  private loadVitals() {
    this.vitalsLoading = true;

    this.patientService.getVitalsList().subscribe({
      next: (res: Vital[]) => {
        const list = (res || []).filter((v) => v?.isActive);
        this.vitalsList = list.map((v) => {
          const { icon, iconClass } = this.getVitalIcon(v.vitalName);
          return {
            ...v,
            value: v.value ?? '',
            icon,
            iconClass,
            unit: this.extractUnit(v.referenceRange),
          };
        });
        this.vitalsLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.vitalsLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load vitals' });
      },
    });
  }

  private loadLabs() {
    this.labsLoading = true;

    this.patientService.getLabsList().subscribe({
      next: (res: LabTest[]) => {
        const raw = res || [];

        const hasAnyRealLab = raw.some((x) => !!(x?.labTestName || '').trim());
        if (!hasAnyRealLab) {
          this.labsList = this.buildLabPlaceholders();
        } else {
          this.labsList = raw.map((x, idx) => ({
            ...x,
            labTestName: (x.labTestName ?? `Lab Test ${idx + 1}`) as string,
            description: x.description ?? '—',
            isActive: x.isActive ?? true,
          }));
        }

        this.initLabGroupsFromLabsList();
        this.labsLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.labsList = this.buildLabPlaceholders();
        this.initLabGroupsFromLabsList();
        this.labsLoading = false;

        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Labs API failed, showing placeholders',
        });
      },
    });
  }

  private initLabGroupsFromLabsList() {
    // make 1 group per lab
    this.labGroups = (this.labsList || []).map((lab, idx) => ({
      labTestLookupId: lab.id ?? idx + 1, // fallback id
      labTestName: (lab.labTestName ?? `Lab Test ${idx + 1}`) as string,
      entries: [this.createEmptyLabEntry()],
    }));
  }

  private createEmptyLabEntry(): LabEntryRow {
    return {
      labTestDate: '',
      testWithMedicineS: '',
      testResultValue: '',
      testResultUnit: '',
      referenceValue: '',
      remark: '',
    };
  }

  addEntryToGroup(group: LabGroup) {
    group.entries.push(this.createEmptyLabEntry());
  }

  removeEntryFromGroup(group: LabGroup, entryIndex: number) {
    group.entries.splice(entryIndex, 1);
    if (group.entries.length === 0) group.entries.push(this.createEmptyLabEntry());
  }

  // ===================== Objective Save =====================
  private buildObjectivePayload(): ObjectiveSavePayload {
    const vitals: VitalSaveItem[] = (this.vitalsList || [])
      .filter((v) => v.value !== null && v.value !== undefined && String(v.value).trim() !== '')
      .map((v) => ({
        vitalLookupId: v.vitalId,
        measurementType: v.vitalName ?? '',
        vitalValue: String(v.value).trim(),
      }));

    const labTests: LabTestSaveItem[] = (this.labGroups || []).flatMap((g) =>
      (g.entries || [])
        .filter((e) => e.labTestDate || e.testWithMedicineS || e.testResultValue || e.remark)
        .map((e) => ({
          labTestLookupId: g.labTestLookupId,
          labTestDate: e.labTestDate || '',
          testWithMedicineS: e.testWithMedicineS || '',
          testResultValue: e.testResultValue || '',
          testResultUnit: e.testResultUnit || '',
          referenceValue: e.referenceValue || '',
          remark: e.remark || '',
        }))
    );

    return {
      patientId: Number(this.patientId ?? 0),
      patientVisitId: 0,
      labTests,
      vitals,
    };
  }

  onSaveObjective() {
    if (!this.patientId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Patient ID is missing' });
      return;
    }

    const payload = this.buildObjectivePayload();
    console.log('Objective Payload:', payload);

    this.patientService.saveObjective(payload).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Saved',
          detail: res?.message || 'Objective saved successfully',
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save objective' });
      },
    });
  }

  // ===================== Icons + Units =====================
  private getVitalIcon(vitalName: string): { icon: string; iconClass: string } {
    const name = (vitalName || '').toLowerCase();

    if (name.includes('temperature')) return { icon: '🌡️', iconClass: 'bg-purple' };
    if (name.includes('pulse') || name.includes('heart')) return { icon: '❤️', iconClass: 'bg-red' };
    if (name.includes('systolic') || name.includes('diastolic') || name.includes('bp') || name.includes('blood')) {
      return { icon: '🩺', iconClass: 'bg-lightblue' };
    }
    if (name.includes('respiratory') || name.includes('breath')) return { icon: '🫁', iconClass: 'bg-green' };
    if (name.includes('oxygen') || name.includes('spo2') || name.includes('saturation')) return { icon: '🫁', iconClass: 'bg-green' };
    if (name.includes('glucose') || name.includes('fbs') || name.includes('ppbs')) return { icon: '🧪', iconClass: 'bg-blue' };
    if (name.includes('hba1c')) return { icon: '🧬', iconClass: 'bg-blue' };
    if (name.includes('bmi')) return { icon: '⚖️', iconClass: 'bg-blue' };

    return { icon: '📌', iconClass: 'bg-blue' };
  }

  private extractUnit(referenceRange: string): string {
    const rr = (referenceRange || '').trim();
    if (!rr) return '';
    const match = rr.match(/([a-zA-Z%°/²µ]+)$/);
    return match?.[1] ?? '';
  }

  private buildLabPlaceholders(count = this.DEFAULT_LABS_COUNT): LabTest[] {
    return Array.from({ length: count }).map((_, i) => ({
      id: null,
      labTestName: `Lab Test ${i + 1}`,
      description: '—',
      isActive: true,
    }));
  }

  // ===================== Utils =====================
  calculateDOBToAge(dob?: string | Date): number {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(Number(dob), today.getMonth(), today.getDate());
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }
}