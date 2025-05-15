import { Component } from '@angular/core';
import { bootstrapGithub, bootstrapInboxFill, bootstrapLinkedin, bootstrapPinAngleFill, bootstrapTelephoneFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-footer',
  imports: [NgIcon],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  providers: [provideIcons({ bootstrapLinkedin, bootstrapGithub, bootstrapTelephoneFill, bootstrapInboxFill, bootstrapPinAngleFill })]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
