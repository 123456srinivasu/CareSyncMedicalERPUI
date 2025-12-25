// src/app/auth/login.component.ts
import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";

import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../shared/service/auth.service";
import { ConduitUser } from "../../../shared/model/auth.models";

@Component({
  standalone: true,
  selector: "app-login",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.html",
  styleUrls: ["./login.css"],
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  private returnUrl = computed(
    () => this.route.snapshot.queryParamMap.get("returnUrl") ?? "/dashboard"
  );

  onSubmit() {
    console.log("LoginComponent.onSubmit");
    // if (this.form.invalid || this.submitting()) return;
    this.error.set(null);
    this.submitting.set(true);

    const { email, password } = this.form.getRawValue();

    // Dev: immediately set a mock user and navigate to the returnUrl/dashboard
    const MOCK_CONDUIT_USER: ConduitUser = {
      email: "admin@conduit.app",
      token: "mock-jwt-token-1234567890",
      username: "admin",
      bio: "System administrator for the Conduit demo application",
      image: "https://i.pravatar.cc/150?img=3",
    };
    this.auth.setUser(MOCK_CONDUIT_USER);
    this.router.navigateByUrl(this.returnUrl());
    this.submitting.set(false);
    return;
  }
}
