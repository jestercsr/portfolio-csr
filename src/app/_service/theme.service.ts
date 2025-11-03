import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeMode = new BehaviorSubject<ThemeMode>('system');
  themeMode$ = this.themeMode.asObservable();

  private appliedTheme = new BehaviorSubject<'light' | 'dark'>('light');
  appliedTheme$ = this.appliedTheme.asObservable();

  constructor() {
    const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'system';
    this.setTheme(savedTheme);
  }

  private listenToSystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = (dark: boolean) => {
      const theme = dark ? 'dark' : 'light';
      this.applyTheme(theme);
      this.appliedTheme.next(theme);
    };

    apply(prefersDark.matches);
    prefersDark.addEventListener('change', (e) => {
      if (this.themeMode.value === 'system') apply(e.matches);
    });
  }

  private applyTheme(theme: 'light' | 'dark') {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    this.appliedTheme.next(theme);
  }

  setTheme(mode: ThemeMode) {
    this.themeMode.next(mode);
    localStorage.setItem('theme', mode);

    if (mode === 'system') {
      this.listenToSystemTheme();
    } else {
      this.applyTheme(mode);
    }
  }

  get currentMode() {
    return this.themeMode.value;
  }

  get currentAppliedTheme() {
    return this.appliedTheme.value;
  }
}
