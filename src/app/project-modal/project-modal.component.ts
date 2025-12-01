import { Component } from '@angular/core';
import { NgbCarousel, NgbModal, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../_models/Project';
import { NgFor, NgIf } from '@angular/common';
import { SafePipe } from '../pipes/safe.pipe';

@Component({
  selector: 'app-project-modal',
  imports: [NgbCarousel, NgbSlide, NgFor, NgIf, SafePipe],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  project = {} as Project;

  constructor(public activeModal: NgbModal) {}

  isGame(): boolean {
    return this.project.type === 'game';
  }

  getGameUrl(): string {
    return this.project.gameUrl || '';
  }

  getSourceCodeUrl(): string {
    return this.project.projectLink || '';
  }
}
