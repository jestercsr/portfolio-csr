import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin, bootstrapGithub } from '@ng-icons/bootstrap-icons';
import { VirtualCardComponent } from "../virtual-card/virtual-card.component";
import { FeedbackComponent } from "../feedback/feedback.component";

@Component({
  selector: 'app-contact',
  imports: [VirtualCardComponent ], //, FeedbackComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  providers: [provideIcons({ bootstrapLinkedin, bootstrapGithub })]
})
export class ContactComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Contact - Portfolio de Jester CESAR');
  }
}
