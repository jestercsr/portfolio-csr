import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProjectsService } from '../_service/projects.service';
import { Project } from '../_models/Project';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { ThemeService } from '../_service/theme.service';

@Component({
  selector: 'app-home',
  imports: [NgbCarousel, NgFor, NgbSlide],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  featuredProjects = {} as Project;
  constructor(
    private titleService: Title,
    private renderer: Renderer2,
    private projectsService: ProjectsService,
    public themeService: ThemeService,
    private el: ElementRef
  ) {
    this.titleService.setTitle('Accueil - Portfolio de Jester CESAR');
  }

  DownloadFile() {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '/cv-jester-cesar.pdf');
    link.setAttribute('download', 'cv-jester-cesar.pdf');
    link.click();
    link.remove();
  }

  ngOnInit(): void {
    this.featuredProjects = this.projectsService.GetLastProject();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-on-scroll');
          }
        });
      },
      { threshold: 0.2 }
    );

    this.el.nativeElement
      .querySelectorAll('.fade-up, .fade-up-delay, .fade-up-delay-2')
      .forEach((el: HTMLElement) => observer.observe(el));
  }
}
