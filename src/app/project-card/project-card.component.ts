import { Component, Input } from '@angular/core';
import { Project } from '../_models/Project';
import { NgFor } from '@angular/common';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-project-card',
  imports: [NgFor, NgbModalModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project = {} as Project;

  constructor(private modalService: NgbModal) {}

  OpenProjectModal(project: Project) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      keyboard: false
      
    }
    const modalRef = this.modalService.open(ProjectModalComponent, modalOptions);
    modalRef.componentInstance.project = project;
  }

}
