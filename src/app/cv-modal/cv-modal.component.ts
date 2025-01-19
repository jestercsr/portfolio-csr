import { Component, Input } from '@angular/core';
import { Project } from '../_models/Project';

@Component({
  selector: 'app-cv-modal',
  imports: [],
  templateUrl: './cv-modal.component.html',
  styleUrl: './cv-modal.component.css'
})
export class CvModalComponent {

  @Input() project = {} as Project
}
