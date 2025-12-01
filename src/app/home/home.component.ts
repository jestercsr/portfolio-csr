import { Component, ElementRef, OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  featuredProjects = {} as Project;
  private raindrops: HTMLElement[] = [];
  private animationFrameId: number | null = null;
  private observer!: IntersectionObserver;

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
    this.observer = new IntersectionObserver(
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
      .forEach((el: HTMLElement) => this.observer.observe(el));

    this.initRainAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.raindrops.forEach(drop => drop.remove());
    const rain = this.el.nativeElement.querySelector('.rain-container');
    if (rain) rain.remove();
    if (this.observer) this.observer.disconnect();
  }

  private initRainAnimation(): void {
    const heroSection = this.el.nativeElement.querySelector('.hero-section');
    if (!heroSection) return;

    const rainContainer = this.renderer.createElement('div');
    this.renderer.addClass(rainContainer, 'rain-container');
    this.renderer.appendChild(heroSection, rainContainer);

    const numberOfDrops = Math.floor(window.innerWidth / 15);
    for (let i = 0; i < numberOfDrops; i++) {
      this.createRaindrop(rainContainer);
    }

    this.animateRain(rainContainer);
  }

  private createRaindrop(container: HTMLElement): void {
    const drop = this.renderer.createElement('div');
    this.renderer.addClass(drop, 'raindrop');

    const x = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 2 + Math.random() * 2;
    const opacity = 0.3 + Math.random() * 0.4;
    const size = 1 + Math.random() * 2;

    this.renderer.setStyle(drop, 'left', `${x}%`);
    this.renderer.setStyle(drop, 'animation-delay', `${delay}s`);
    this.renderer.setStyle(drop, 'animation-duration', `${duration}s`);
    this.renderer.setStyle(drop, 'opacity', opacity);
    this.renderer.setStyle(drop, 'width', `${size}px`);

    this.renderer.appendChild(container, drop);
    this.raindrops.push(drop);
  }

  private animateRain(container: HTMLElement): void {
    let lastTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastTime;

      if (elapsed > 200) {
        this.createRaindrop(container);
        lastTime = currentTime;

        if (this.raindrops.length > 100) {
          const oldDrop = this.raindrops.shift();
          if (oldDrop) {
            this.renderer.removeChild(container, oldDrop);
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}