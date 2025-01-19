import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '../_models/Project';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectsService } from '../_service/projects.service';
import { NgbCollapseConfig, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from '../_models/Tag';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

type TagKey = keyof typeof Tag;
@Component({
  selector: 'app-portfolio',
  imports: [ProjectCardComponent, NgFor, NgbCollapseModule, FormsModule, CommonModule, FooterComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
  providers: [NgbCollapseConfig]
})
export class PortfolioComponent implements OnInit {

  projects = {} as Project[];

  isCollapsed: boolean = true;
  tags: Record<string, boolean> = {
    typescript: false,
    angular: false,
    react: false,
    nextjs: false,
    nodejs: false,
    tailwindcss: false,
    cplusplus: false,
    java: false,
    javascript: false,
    html: false,
    css: false,
    python: false,
    php: false,
    mysql: false,
    mongodb: false,
    spring: false
  };

  filtering: boolean = false;
  
  constructor(private titleService: Title, private projectsService: ProjectsService, config: NgbCollapseConfig) {
    this.titleService.setTitle('Portfolio - Portfolio de Jester CESAR');
    config.animation = true
  }
  ngOnInit(): void {
    this.projects = this.projectsService.GetProjects()
  }
  Filter(){
    let filterTag: Tag[] = [];
    for (let tag in this.tags) {
      if (this.tags[tag as TagKey]) {
        const tagInstance = Tag[tag.toUpperCase() as keyof typeof Tag];
        if (tagInstance) {
          filterTag.push(tagInstance);
        }
      }
    }
    this.filtering = filterTag.length > 0;
    this.projects = this.projectsService.GetProjectsByFilter(filterTag);
  }

  ResetFilter(){
    for (let tag in this.tags) {
      this.tags[tag as TagKey] = false;
    }
    this.filtering = false;
    this.projects = this.projectsService.GetProjects();
  }
}
