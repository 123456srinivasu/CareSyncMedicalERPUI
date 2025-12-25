import { Injectable, inject, computed, effect, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConduitUser, LoginRequest, LoginResponse } from "../model/auth.models";
import { environment } from "../../env/env";

const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";

function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function getJwtExpiryMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000; // seconds -> ms
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);

  private _user = signal<ConduitUser | null>(null);
  user = this._user.asReadonly();

  token = computed(() => this._user()?.token ?? null);
  isAuthenticated = computed(() => !!this.token());

  /** Epoch ms when the current JWT expires (or null if not logged in / no exp) */
  tokenExpiryMs = computed<number | null>(() => {
    const t = this.token();
    return t ? getJwtExpiryMs(t) : null;
  });

  /** Convenience: username/email preview (null if logged out) */
  displayName = computed(
    () => this._user()?.username ?? this._user()?.email ?? null
  );

  private logoutTimer: any = null;

  constructor() {
    this.restoreFromStorage();
    // Keep localStorage in sync when the user changes
    effect(() => {
      const u = this._user();
      if (u) {
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        localStorage.setItem(TOKEN_KEY, u.token);
        this.scheduleAutoLogout(u.token);
      } else {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        this.clearLogoutTimer();
      }
    });
  }

  login(email: string, password: string) {
    const body: LoginRequest = { user: { email, password } };
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}`, body);
  }

  setUser(user: ConduitUser) {
    this._user.set(user);
  }

  fetchCurrentUser() {
    // Conduit: GET /user expects Authorization header (interceptor adds it)
    return this.http.get<{ user: ConduitUser }>(`${environment.apiBaseUrl}`);
  }

  logout() {
    this._user.set(null);
  }

  /** Called by interceptor on 401, or locally on token expiry */
  handleAuthFailure() {
    this.logout();
  }

  // ---- storage & timers ----
  private restoreFromStorage() {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUserRaw = localStorage.getItem(USER_KEY);

    if (token && storedUserRaw) {
      const expiry = getJwtExpiryMs(token);
      if (expiry && Date.now() < expiry) {
        try {
          const user = JSON.parse(storedUserRaw) as ConduitUser;
          this._user.set(user);
          this.scheduleAutoLogout(token);
          return;
        } catch {
          /* ignore parse errors */
        }
      }
    }
    this._user.set(null);
  }

  private scheduleAutoLogout(token: string) {
    this.clearLogoutTimer();
    const expiry = getJwtExpiryMs(token);
    if (!expiry) return; // unknown exp, skip

    const msLeft = expiry - Date.now();
    if (msLeft <= 0) {
      this.handleAuthFailure();
      return;
    }
    // Auto-logout exactly when JWT expires
    this.logoutTimer = setTimeout(() => this.handleAuthFailure(), msLeft);
  }

  private clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
