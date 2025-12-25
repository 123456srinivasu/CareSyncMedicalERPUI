// src/app/shell/shell.component.ts
import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../../shared/service/auth.service";

@Component({
  standalone: true,
  selector: "app-shell",
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./shell.html",
  styleUrls: ["./shell.css"],
})
export class ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
}
