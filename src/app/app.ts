import { Component, inject, effect } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "../shared/service/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: "./app.css",
})
export class AppComponent {
  private auth = inject(AuthService);

  constructor() {
    effect(() => {
      const token = this.auth.token();
      if (token) {
        this.auth.fetchCurrentUser().subscribe({
          next: () => {},
          error: () => this.auth.handleAuthFailure(),
        });
      }
    });
  }
}
