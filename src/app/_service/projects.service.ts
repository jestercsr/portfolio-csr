import { Injectable } from '@angular/core';
import { Project } from '../_models/Project';
import { Tag } from '../_models/Tag';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  projects: Project[] = [
    {
      id: 0,
      nom: 'Champs de mine',
      sommaire:
        'Exercice fait pendant le cours de Programmation lors de ma licence Informatique',
      description:
        'Programmation d’une version simplifiée du jeu du champs de mines. Projet realisé en Java.',
      image: [
        '/projet/mine-screen1.webp',
        '/projet/mine-screen2.webp',
        '/projet/mine-screen3.webp',
      ],
      tags: [Tag.JAVA],
      projectLink: 'https://github.com/jestercsr/Champsdemine',
      where: 'Github',
      titre: 'Champs de mine - 2020',
    },
    {
      id: 1,
      nom: 'Arrow - Fan site',
      sommaire:
        'Projet noté du cours de Base de données et programmation web fait pendant la licence Informatique',
      description:
        "Programmation d’un site web avec une base de données qui permet d'accèder à une wiki des séries du Arrowverse. Projet réalisé avec React.",
      image: [
        '/projet/arrow-screen1.webp',
        '/projet/arrow-screen2.webp',
        '/projet/arrow-screen3.webp',
      ],
      tags: [Tag.REACT, Tag.TAILWINDCSS],
      projectLink: '',
      where: 'Github',
      titre: 'Arrow le site fan - 2021',
    },
    {
      id: 2,
      nom: 'Jeu du Damier',
      sommaire:
        'Exercice noté du cours de Programmation fait pendant la licence Informatique',
      description:
        'Programmation d’un jeu qui permet de retirer des briques et obtenir un score total en fonction des combinaisons faites par l’utilisateur. Projet réalisé en Java.',
      image: [
        '/projet/damier-screen1.webp',
        '/projet/damier-screen2.webp',
        '/projet/damier-screen3.webp',
      ],
      tags: [Tag.JAVA],
      projectLink: 'https://github.com/jestercsr/JeuduDamiers',
      where: 'Github',
      titre: 'Jeu du Damier - 2021',
    },
    {
      id: 3,
      nom: 'Projet Auto-Ecole',
      sommaire:
        'Exercice noté du cours de Génie Logiciel fait pendant la licence Informatique',
      description:
        'Programmation d’un logiciel de gestion d’une auto-école afin de réserver, gérer les moniteurs, les plannings, les paiements et les véhicules disponibles. Projets réalisés en Java et MySQL.',
      image: [],
      tags: [Tag.JAVA],
      projectLink: 'https://github.com/jestercsr/ProjetAutoecole',
      where: 'Github',
      titre: 'Logiciel de gestion Auto Ecole - 2022',
    },
    {
      id: 4,
      nom: 'E-commerce',
      sommaire:
        "Exercice de création d'un site de vente de produits lors de la formation de Concepteur Développeur d'Applications.",
      description:
        "Développement d'une application web de vente de produits en ligne. Projet realise sur React et Spring Boot.",
      image: [
        '/projet/ecommerce-screen1.webp',
        '/projet/ecommerce-screen2.webp',
      ],
      tags: [Tag.REACT, Tag.SPRING, Tag.JAVASCRIPT],
      projectLink: 'https://github.com/jestercsr/ecommerce',
      where: 'Github',
      titre: 'E-commerce - 2024',
    },
    {
      id: 5,
      nom: 'Anime ONE',
      sommaire:
        "Projet final de la formation de Concepteur Développeur d'Applications",
      description:
        'Développement d’une application web d’un service de streaming afin de regarder des films, séries et lectures en ligne d’animés, une plateforme de vente, gestion d’utilisateurs et des postes d’utilisateurs. Projet réalisé sur Next.js avec 2 bases de données SQL et NoSQL.',
      image: [
        '/projet/animeOne-screen1.webp',
        '/projet/animeOne-screen2.webp',
        '/projet/animeOne-screen3.webp',
      ],
      tags: [Tag.NEXTJS, Tag.REACT, Tag.NODEJS, Tag.TAILWINDCSS],
      projectLink: 'https://anime-one-project.vercel.app',
      where: 'Vercel',
      titre: 'Service de streaming AnimeONE - 2024',
    },
    {
      id: 6,
      nom: "Site de l'association Saint-Raphaël",
      sommaire: "Création du site web de l'association Saint-Raphaël.",
      description:
        "Développement d'un site web pour l'association Saint-Raphaël pour faciliter leur gestion des dons, de bénéficiaires et de membres. Projet réalisé sur Next.js.",
      image: ['/projet/raphael-screen1.webp', '/projet/raphael-screen2.webp'],
      tags: [Tag.NEXTJS, Tag.REACT, Tag.NODEJS, Tag.TAILWINDCSS],
      projectLink: '',
      where: 'En cours',
      titre: "Site de l'association Saint-Raphaël - 2024 / 2025",
    },
    {
      id: 7,
      nom: 'Portfolio',
      sommaire:
        'Création de mon portfolio afin de montrer mes projets et mes connaissances.',
      description:
        "Développement d'un site web pour montrer mes projets et mes connaissances. Projet réalisé sur Angular.",
      image: [
        '/projet/portfolio-screen1.webp',
        '/projet/portfolio-screen2.webp',
        '/projet/portfolio-screen3.webp',
      ],
      tags: [Tag.ANGULAR, Tag.TYPESCRIPT, Tag.BOOTSTRAP],
      projectLink: 'https://portfolio-jester-cesar.vercel.app',
      where: 'Vercel',
      titre: 'Portfolio - 2025',
    },
    {
      id: 8,
      nom: 'Nova ERP',
      sommaire: "Création d'une application de gestion d'entreprise.",
      description:
        "Développement d'une application web qui permet « de gérer l'ensemble des processus d'une entreprise en intégrant l'ensemble de ses fonctions, dont la gestion des ressources humaines, la gestion comptable et financière, l'aide à la décision, mais aussi la vente, la distribution, l'approvisionnement et le commerce électronique ». Projet réalisé sur Next.js.",
      image: [
        '/projet/erp-screen1.webp',
        '/projet/erp-screen2.webp',
        '/projet/erp-screen3.webp',
        '/projet/erp-screen4.webp',
      ],
      tags: [Tag.NEXTJS, Tag.TYPESCRIPT, Tag.TAILWINDCSS],
      projectLink: '',
      where: 'Electron',
      titre: 'Nova ERP - 2025',
    },
  ];

  constructor() {}

  GetProjects() {
    return [...this.projects].sort((a, b) => b.id - a.id);
  }
  GetProjectsById(id: number): Project {
    let project = this.projects.find((project) => project.id === id);
    if (project == undefined) {
      throw new TypeError("Aucun project trouver avec l'id " + id);
    }
    return project;
  }

  GetLastProject() {
    return this.projects.reduce((prev, current) =>
      prev.id > current.id ? prev : current
    );
  }

  GetProjectsByFilter(filtreTag: Tag[]) {
    return this.projects.filter((project) =>
      filtreTag.every((tag) => project.tags.includes(tag))
    );
  }
}
