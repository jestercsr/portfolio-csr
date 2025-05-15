import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCarousel, NgbModal, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { Templates } from '../_models/Templates';

@Component({
  selector: 'app-template-modal',
  imports: [NgbCarousel, NgbSlide, NgFor],
  templateUrl: './template-modal.component.html',
  styleUrl: './template-modal.component.css'
})
export class TemplateModalComponent {
  template = {} as Templates;

  constructor(public activeModal: NgbModal) {}
}
