import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapLinkedin, bootstrapGithub } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-contact',
  imports: [NgIcon],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  providers: [provideIcons({ bootstrapLinkedin, bootstrapGithub })]
})
export class ContactComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Contact - Portfolio de Jester CESAR');
  }
}
