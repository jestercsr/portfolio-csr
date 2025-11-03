import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapTelephoneFill,
  bootstrapInboxFill,
  bootstrapPinAngleFill,
} from '@ng-icons/bootstrap-icons';
import { ContactService } from '../_service/contact.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIcon, FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  providers: [
    provideIcons({
      bootstrapTelephoneFill,
      bootstrapInboxFill,
      bootstrapPinAngleFill,
    }),
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  name = '';
  email = '';
  message = '';
  isSending = false;
  successMessage = '';
  errorMessage = '';

  constructor(private contactService: ContactService) {}

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.name || !this.email || !this.message) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    this.isSending = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.contactService
      .sendMessage({
        name: this.name,
        email: this.email,
        message: this.message,
      })
      .subscribe({
        next: () => {
          this.successMessage = '✅ Message envoyé avec succès !';
          this.isSending = false;
          this.name = '';
          this.email = '';
          this.message = '';
        },
        error: () => {
          this.errorMessage = '❌ Erreur lors de l’envoi du message.';
          this.isSending = false;
        },
      });
  }
}
