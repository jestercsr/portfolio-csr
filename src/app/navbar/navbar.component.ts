import { NgClass, NgFor } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapCodeSlash,
  bootstrapGearFill,
  bootstrapMoonFill,
  bootstrapSunFill,
} from '@ng-icons/bootstrap-icons';
import { ThemeMode, ThemeService } from '../_service/theme.service';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgFor, NgIcon, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [
    provideIcons({
      bootstrapCodeSlash,
      bootstrapSunFill,
      bootstrapMoonFill,
      bootstrapGearFill,
    }),
  ],
})
export class NavbarComponent {
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;

  isScrolled = false;
  isDarkMode = false;
  menuOpen = false;
  currentMode: ThemeMode = 'system';
  appliedTheme: 'light' | 'dark' = 'light';

  constructor(public themeService: ThemeService) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    const navbar = document.getElementById('navbarNav');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  setTheme(mode: ThemeMode) {
    this.themeService.setTheme(mode);
  }

  get themeIcon() {
    switch (this.currentMode) {
      case 'dark':
        return 'bootstrapMoonFill';
      case 'light':
        return 'bootstrapSunFill';
      default:
        return 'bootstrapGearFill';
    }
  }

  navbarLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/portfolio', label: 'Projets' },
    { path: '/cv', label: 'CV' },
    { path: '/template', label: 'Templates' },
    { path: '/tarif', label: 'Tarifs' },
    { path: '/contact', label: 'Contact' },
  ];

  ngOnInit() {
    this.themeService.themeMode$.subscribe((mode) => (this.currentMode = mode));
    this.themeService.appliedTheme$.subscribe(
      (theme) => (this.appliedTheme = theme)
    );
  }
}
