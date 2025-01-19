import { Injectable } from '@angular/core';
import { Project } from '../_models/Project';
import { Tag } from '../_models/Tag';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  projects: Project[] = [
    {
      id: 0,
      nom: 'Site de l\'association Saint-Raphël',
      sommaire:
        'Création du site web de l\'association Saint-Raphël.',
      description: 'Développement d\'un site web pour l\'association Saint-Raphël pour faciliter leur gestion des dons, de bénéficiaires et de membres. Projet réalisé sur Next.js.',
      image: ['/raphael-screen1.png', '/raphael-screen2.png'],
      tags: [Tag.NEXTJS, Tag.REACT, Tag.NODEJS, Tag.TAILWINDCSS],
      projectLink: '',
      where: 'En cours',
      titre: 'Site de l\'association Saint-Raphël - 2024 / 2025',
    },
    {
      id: 1,
      nom: 'Portfolio',
      sommaire:
        'Création de mon portfolio afin de montrer mes projets et mes connaissances.',
      description: 'Développement d\'un site web pour montrer mes projets et mes connaissances. Projet réalisé sur Angular.',
      image: ['/portfolio-screen2.png', '/portfolio-screen3.png'],
      tags: [Tag.ANGULAR, Tag.TYPESCRIPT, Tag.BOOTSTRAP],
      projectLink: '',
      where: 'Github',
      titre: 'Portfolio - 2025',
    },
    {
      id: 2,
      nom: 'Anime ONE',
      sommaire:
        'Projet final de la formation de Concepteur Développeur d\'Applications',
      description: 'Développement d’une application web d’un service de streaming afin de regarder des films, séries et lectures en ligne d’animés, une plateforme de vente, gestion d’utilisateurs et des postes d’utilisateurs. Projet réalisé sur Next.js.',
      image: ['/animeOne-screen1.png', '/animeOne-screen2.png', '/animeOne-screen3.png'],
      tags: [Tag.NEXTJS, Tag.REACT, Tag.NODEJS, Tag.TAILWINDCSS],
      projectLink: 'https://anime-one-project.vercel.app',
      where: 'Vercel',
      titre: 'Service de streaming AnimeONE - 2024', 
    },
    {
      id: 3,
      nom: 'E-commerce',
      sommaire:
        'Exercice de création d\'un site de vente de produits lors de la formation de Concepteur Développeur d\'Applications.',
      description: 'Développement d\'une application web de vente de produits en ligne. Projet realise sur React et Spring Boot.',
      image: ['/ecommerce-screen1.png', '/ecommerce-screen2.png'],
      tags: [Tag.REACT, Tag.SPRING, Tag.JAVASCRIPT],
      projectLink: 'https://github.com/jestercsr/ecommerce',
      where: 'Github',
      titre: 'E-commerce - 2024',
    },
    {
      id: 4,
      nom: 'Projet Auto-Ecole',
      sommaire:
        'Exercice noté du cours de Génie Logiciel fait pendant la licence Informatique',
      description: 'Programmation d’un logiciel de gestion d’une auto-école afin de réserver, gérer les moniteurs, les plannings, les paiements et les véhicules disponibles. Projets réalisés en Java et MySQL.',
      image: [],
      tags: [Tag.JAVA],
      projectLink: 'https://github.com/jestercsr/ProjetAutoecole',
      where: 'Github',
      titre: 'Logiciel de gestion Auto Ecole - 2022',
    },
    {
      id: 5,
      nom: 'Jeu du Damier',
      sommaire:
        'Exercice noté du cours de Programmation fait pendant la licence Informatique',
      description: 'Programmation d’un jeu qui permet de retirer des briques et obtenir un score total en fonction des combinaisons faites par l’utilisateur. Projet réalisé en Java.',
      image: [],
      tags: [Tag.JAVA],
      projectLink: 'https://github.com/jestercsr/JeuduDamiers',
      where: 'Github',
      titre: 'Jeu du Damier - 2021'
    },
    {
      id: 6,
      nom: 'Champs de mine',
      sommaire:
        'Exercice fait pendant le cours de Programmation lors de ma licence Informatique',
      description: 'Programmation d’une version simplifiée du jeu du champs de mines. Projet realisé en Java.',
      image: [],
      tags: [Tag.JAVA],
      projectLink: 'https://github.com/jestercsr/Champsdemine',
      where: 'Github',
      titre: 'Champs de mine - 2021'    
    }
  ];

  constructor() { }

  GetProjects(){
    return this.projects
  }
  GetProjectsById(id: number): Project{
    let project = this.projects.find(project => project.id === id)
    if(project == undefined){
      throw new TypeError('Aucun project trouver avec l\'id ' + id)
    }
    return project
  }

  GetProjectsByFilter(filtreTag: Tag[]){
    return this.projects.filter(project =>
      filtreTag.every(tag => project.tags.includes(tag))
    );
  }
}
