import { NgFor } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapCodeSlash } from '@ng-icons/bootstrap-icons';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgFor, NgIcon],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [provideIcons({ bootstrapCodeSlash })]
})
export class NavbarComponent {
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  closeMenu() {
    const collapseElement = this.navbarCollapse?.nativeElement;
    if (collapseElement?.classList.contains('show')) {
      new bootstrap.Collapse(collapseElement, {
        toggle: true,
      });
    }
  }

  navbarLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/portfolio', label: 'Projets' },
    { path: '/cv', label: 'CV' },
    { path: '/template', label: 'Templates' },
    { path: '/contact', label: 'Contact' }
  ]
}
