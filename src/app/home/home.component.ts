import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProjectsService } from '../_service/projects.service';
import { Project } from '../_models/Project';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [NgbCarousel, NgFor, NgbSlide, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  featuredProjects = {} as Project;
  constructor(private titleService: Title, private projectsService: ProjectsService) {
    this.titleService.setTitle('Accueil - Portfolio de Jester CESAR');
  }
  ngOnInit(): void {
    this.featuredProjects = this.projectsService.GetProjectsById(0)
  }
}
