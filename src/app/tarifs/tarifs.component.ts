import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCollapseConfig, NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';
import { Title } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapBriefcaseFill, bootstrapCheck2Circle, bootstrapFileEarmarkFill, bootstrapFloppy2Fill, bootstrapRocketTakeoff, bootstrapStopwatch } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-tarifs',
  imports: [NgClass, NgFor, NgIf, NgbModalModule, NgIcon],
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.css',
  providers: [
    provideIcons({
      bootstrapRocketTakeoff,
      bootstrapStopwatch,
      bootstrapBriefcaseFill,
      bootstrapFileEarmarkFill,
      bootstrapFloppy2Fill,
      bootstrapCheck2Circle
    }),
  ],
})
export class TarifsComponent {
  formules = [
    {
      titre: 'Formule Starter',
      prix: '1500 €',
      details: [
        'Site vitrine (max 5 pages)',
        'Maquette simple',
        '1 formulaire de contact',
        '1 cahier des charges personnalisé',
        'Mise en ligne (hébergement client)',
        '3 tickets de maintenance inclus',
        'Délais : 10 à 15 jours (si 15 jours → 2500 €)',
      ],
      delais: 'Délais 10 à 15 jours',
    },
    {
      titre: 'Formule Booster',
      prix: '5000 €',
      details: [
        'Site vitrine ou e-commerce léger (max 8 pages)',
        'Maquette responsive',
        'Formulaires avancés',
        'Dashboard admin personnalisé',
        'Aide à l’achat nom de domaine + hébergement',
        'SEO inclus',
        '6 tickets de maintenance inclus',
        'Délais 3 semaines (si 22 jours → 6500 €)',
      ],
      delais: 'Délais 3 semaines',
    },
    {
      titre: 'Formule Pro Max',
      prix: '8000 €',
      details: [
        'Accompagnement complet',
        'Site e-commerce ou app web (max 12 pages/modules)',
        'Plusieurs maquettes UX/UI',
        'Contrat de suivi mensuel possible',
        'Aide à la rédaction des contenus',
        'Interface admin complète (formulaires CRUD)',
        '10 tickets de maintenance inclus',
        'Délais 1 à 3 mois (si 3 mois → 12000 €)',
      ],
      delais: 'Délais 1 à 3 mois',
    },
  ];

  tarifs = [
    { type: 'Site vitrine', prix: '250', detail: '250 € / jour' },
    { type: 'Site e-commerce', prix: '350', detail: '350 € / jour' },
    { type: 'Application web', prix: '500', detail: '500 € / jour' },
    { type: 'Site no-code', prix: '500', detail: '500 €' },
    { type: 'Refonte Backend', prix: '600', detail: '300 € - 1000 €' },
    { type: 'Refonte Frontend', prix: '3800', detail: '1800 € - 5500 €' },
    { type: 'Refonte Fullstack', prix: '4500', detail: '3000 € - 7000 €' },
    { type: 'Maintenance - Ticket unique', prix: '40', detail: 'à partir de 40 €' },
    { type: 'Maintenance - Pack 5 tickets', prix: '150', detail: '150 €' },
    { type: 'Maintenance - Pack 10 tickets', prix: '300', detail: '300 €' },
    { type: 'Maintenance - par mois', prix: '250', detail: 'à partir de 150 € / mois' },
    { type: 'NovaERP (logiciel de gestion)', prix: '3600', detail: 'à partir de 3600 €' },
  ];

  constructor(private modalService: NgbModal, private titleService: Title, config: NgbCollapseConfig) {
    this.titleService.setTitle('Tarifs - Portfolio de Jester CESAR');
    config.animation = true
  }

  openInvoiceModal(item: any) {
    const modalOptions: NgbModalOptions = {
      size: 'xl',
      backdrop: 'static',
      keyboard: true,
      centered: true
    }

    const modalRef = this.modalService.open(InvoiceModalComponent, modalOptions);
    modalRef.componentInstance.offer = item;
    modalRef.componentInstance.provider = {
      company: 'Jester CESAR',
      addressLine1: '1O rue de Varennes',
      addressLine2: '95190 GOUSSAINVILLE',
      phone: '06 04 52 32 70',
      siret: '992 596 338 00010',
      email: 'jester.csr@gmail.com',
    };
  }

  getAnimation(index: number) {
    const animations = [
      'animate__fadeInLeft',
      'animate__fadeInUp',
      'animate__fadeInRight',
    ];
    return animations[index % animations.length];
  }
}
