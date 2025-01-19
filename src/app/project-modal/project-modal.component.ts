import { Component } from '@angular/core';
import { NgbCarousel, NgbModal, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../_models/Project';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-project-modal',
  imports: [NgbCarousel, NgbSlide, NgFor],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  project = {} as Project;

  constructor(public activeModal: NgbModal) {}
}
