import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceModalComponent } from '../invoice-modal/invoice-modal.component';

@Component({
  selector: 'app-tarifs',
  imports: [NgClass, NgFor, NgIf, NgbModalModule],
  templateUrl: './tarifs.component.html',
  styleUrl: './tarifs.component.css',
})
export class TarifsComponent {
  formules = [
    {
      titre: 'Formule 1',
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
      titre: 'Formule 2',
      prix: '4000 €',
      details: [
        'Site vitrine ou e-commerce léger (max 8 pages)',
        'Maquette responsive',
        'Formulaires avancés',
        'Dashboard admin personnalisé',
        'Aide à l’achat nom de domaine + hébergement',
        'SEO inclus',
        '6 tickets de maintenance inclus',
        'Délais 3 semaines (si 22 jours → 5500 €)',
      ],
      delais: 'Délais 3 semaines',
    },
    {
      titre: 'Formule 3',
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
    { type: 'Site vitrine', prix: '180', detail: '180 € /j + 30 € (administration)' },
    { type: 'Site e-commerce', prix: '250', detail: '250 € /j + 30 € (administration)' },
    { type: 'Site no-code', prix: '500', detail: '500 €' },
    { type: 'Refonte', prix: '800', detail: '400 € - 1000 €' },
    { type: 'Maintenance - Pack 5 tickets', prix: '100', detail: '100 €' },
    { type: 'Maintenance - Pack 10 tickets', prix: '180', detail: '180 €' },
    { type: 'Maintenance - Ticket unique', prix: '30', detail: 'à partir de 30 €' },
    { type: 'Application web', prix: '400', detail: '400 € /j + 30 € (administration)' },
    { type: 'NovaERP (logiciel de gestion)', prix: '2600', detail: 'à partir de 2600 €' },
  ];

  constructor(private modalService: NgbModal) {}

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
