// src/app/components/camp/camp.ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./camp.html",
  styleUrls: ["./camp.css"],
})
export class CampComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      location: ["", Validators.required],
      mobile: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ["", Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // replace with real save logic
      console.log("Camp submitted:", this.form.value);
      this.form.reset();
    }
  }
}
