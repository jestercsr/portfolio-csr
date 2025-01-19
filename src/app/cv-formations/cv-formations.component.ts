import { Component, Input } from '@angular/core';
import { Formation } from '../_models/Formation';

@Component({
  selector: 'app-cv-formations',
  imports: [],
  templateUrl: './cv-formations.component.html',
  styleUrl: './cv-formations.component.css'
})
export class CvFormationsComponent {

  @Input() formation = {} as Formation
}
