import { Injectable } from '@angular/core';
import { Formation } from '../_models/Formation';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  formations: Formation[] = [
    {
      titre: "Concepteur Développeur d'Applications Bac +3 / 4",
      obtenu: 'Oui',
      lieu: 'Bagnolet',
      annee: '2024',
      etablissement: 'Doranco',
    },
    {
      titre: 'Licence Informatique',
      obtenu: 'Oui',
      lieu: 'Blois',
      annee: '2020 / 2023',
      etablissement: 'Université de Tours',
    },
    {
      titre: 'Licence Arts-plastiques',
      obtenu: 'Non',
      lieu: 'Paris',
      annee: '2019',
      etablissement: 'Université Paris 1 Sorbonne',
    },
    {
      titre: 'Baccalauréat STI2D',
      obtenu: 'Oui',
      lieu: 'Goussainville',
      annee: '2015 / 2018',
      etablissement: 'Lycée Romain Rolland',
    },
  ];
  constructor() {}

  GetFormations() {
    return this.formations;
  }
}
