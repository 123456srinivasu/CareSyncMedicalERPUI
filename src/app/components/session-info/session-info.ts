// src/app/session/session-info.component.ts
import { Component, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/service/auth.service';

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

@Component({
  standalone: true,
  selector: 'app-session-info',
  imports: [CommonModule],
  templateUrl: './session-info.html',
})
export class SessionInfoComponent implements OnDestroy {
  private auth = inject(AuthService);

  // 1s ticking clock
  private now = signal(Date.now());
  private tickId = setInterval(() => this.now.set(Date.now()), 1000);
  ngOnDestroy() {
    clearInterval(this.tickId);
  }

  // derived
  isAuthed = computed(() => this.auth.isAuthenticated());
  displayName = computed(() => this.auth.displayName());
  expiryMs = computed(() => this.auth.tokenExpiryMs());

  timeLeftMs = computed(() => {
    const exp = this.expiryMs();
    if (!exp) return 0;
    return Math.max(0, exp - this.now());
  });

  formattedLeft = computed(() => formatDuration(this.timeLeftMs()));
}
