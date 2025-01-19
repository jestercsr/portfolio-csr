import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navbarLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/cv', label: 'CV' },
    { path: '/contact', label: 'Contact' }
  ]
}
