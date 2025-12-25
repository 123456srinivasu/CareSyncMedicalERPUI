// src/app/app.routes.ts
import { Routes } from "@angular/router";
import { authGuard } from "./shared/guard/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./app/components/login/login").then((m) => m.LoginComponent),
  },

  // Protected shell with a small menu
  {
    path: "",
    // canActivate: [authGuard],
    loadComponent: () =>
      import("./app/components/shell/shell").then((m) => m.ShellComponent),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./app/components/dashboard/dashboard").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "session",
        loadComponent: () =>
          import("./app/components/session-info/session-info").then(
            (m) => m.SessionInfoComponent
          ),
      },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
    ],
  },

  { path: "**", redirectTo: "" },
];
