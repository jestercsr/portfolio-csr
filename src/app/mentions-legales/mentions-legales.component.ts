import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ContactService } from '../_service/contact.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapArrowDownCircleFill,
  bootstrapArrowUpShort,
  bootstrapPrinterFill,
} from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-mentions-legales',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule, NgIcon],
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.css'],
  providers: [
    provideIcons({
      bootstrapPrinterFill,
      bootstrapArrowUpShort,
      bootstrapArrowDownCircleFill,
    }),
  ],
})
export class MentionsLegalesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  name = '';
  email = '';
  subject = '';
  message = '';
  isSending = false;
  successMessage = '';
  errorMessage = '';
  activeSection = '';
  charCount = 0;

  private subscriptions: Subscription[] = [];

  constructor(private contactService: ContactService, private el: ElementRef) {}

  getLabel(id: string) {
    const map: any = {
      identite: "Identité de l'entreprise",
      coordonnees: 'Coordonnées',
      immatriculation: "Numéros d'immatriculation",
      activite: 'Activités',
      publication: 'Direction de publication',
      hebergement: 'Hébergement du site',
      propriete: 'Propriété intellectuelle',
      conditions: "Conditions d'utilisation",
      donnees: 'Protection des données',
      litiges: 'Litiges',
      contact: 'Contact',
    };
    return map[id] || id;
  }

  ngOnInit(): void {
    this.checkActiveSection();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id') || '';
          if (entry.isIntersecting) {
            this.activeSection = id;
          }
        });
      },
      { root: null, rootMargin: '-120px 0px -60% 0px', threshold: 0.15 }
    );
    const sections: NodeListOf<HTMLElement> =
      this.el.nativeElement.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkActiveSection();
  }

  private checkActiveSection() {
    const sections: NodeListOf<HTMLElement> =
      document.querySelectorAll('section[id]');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    sections.forEach((section) => {
      const rectTop = section.offsetTop - 120;
      const rectHeight = section.offsetHeight;
      const id = section.getAttribute('id') || '';
      if (scrollTop >= rectTop && scrollTop < rectTop + rectHeight) {
        this.activeSection = id;
      }
    });
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom() {}

  printPage() {
    window.print();
  }

  handleMessageInput(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value || '';
    this.charCount = value.length;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.name || !this.email || !this.subject || !this.message) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      this.successMessage = '';
      return;
    }

    this.isSending = true;
    this.successMessage = '';
    this.errorMessage = '';

    const sub = this.contactService
      .sendMessageViaML({
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message,
      })
      .subscribe({
        next: () => {
          this.successMessage = '✅ Message envoyé avec succès !';
          this.isSending = false;
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
          this.charCount = 0;
        },
        error: () => {
          this.errorMessage = '❌ Erreur lors de l’envoi du message.';
          this.isSending = false;
        },
      });

    this.subscriptions.push(sub);
  }
}
