import { NgFor } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbAccordionBody, NgbAccordionButton, NgbAccordionCollapse, NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../_models/Project';
import { CvModalComponent } from "../cv-modal/cv-modal.component";
import { ProjectsService } from '../_service/projects.service';
import { CvFormationsComponent } from '../cv-formations/cv-formations.component';
import { FormationService } from '../_service/formation.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapController, bootstrapDownload, bootstrapGlobeAmericas, bootstrapLaptop, bootstrapMortarboardFill, bootstrapRocketTakeoff, bootstrapServer } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-cv',
  imports: [NgIcon, CvModalComponent, CvFormationsComponent, NgFor, NgbAccordionDirective, NgbAccordionItem, NgbAccordionBody, NgbAccordionButton, NgbAccordionCollapse, NgbAccordionHeader, CvModalComponent],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.css',
  providers: [provideIcons({ bootstrapDownload, bootstrapRocketTakeoff, bootstrapGlobeAmericas, bootstrapController, bootstrapLaptop, bootstrapMortarboardFill, bootstrapServer })]
})
export class CvComponent implements OnInit {
formation: any;

  ngOnInit(): void {
    this.projects = this.projectsService.GetProjects()
    this.formation = this.formationsService.GetFormations()
  }
  projects = {} as Project[]
  constructor(private titleService: Title, private renderer: Renderer2, private projectsService: ProjectsService, private formationsService: FormationService) {
    this.titleService.setTitle('CV - Portfolio de Jester CESAR');
  }

  DownloadFile(){
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '/cv-jester-cesar.pdf');
    link.setAttribute('download', 'cv-jester-cesar.pdf');
    link.click();
    link.remove();
  }
}
