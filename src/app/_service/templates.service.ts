import { Injectable } from "@angular/core";
import { Templates } from "../_models/Templates";
import { Tag } from "../_models/Tag";

@Injectable({
  providedIn: 'root'
})

export class TemplatesService {
  templates: Templates[] = [
    {
        id: 0,
        title: 'Template d\'une Agence',
        image: ['/agence-screen1.png', '/agence-screen2.png'],
        description: 'Création d\'un template d\'un site web pour une agence. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-agence',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 1,
        title: 'Template d\'un Blog',
        image: ['/blog-screen1.png', '/blog-screen2.png', '/blog-screen3.png'],
        description: 'Création d\'un template d\'un site web pour un blog. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-blog',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 2,
        title: 'Template d\'un Portfolio',
        image: ['/portfolio-template1.png', '/portfolio-template2.png', '/portfolio-template3.png'],
        description: 'Création d\'un template d\'un site web pour montrer ces projets et ces connaissances. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-portfolio',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 3,
        title: 'Template d\'une boutique E-commerce',
        image: ['/boutique-screen1.png', '/boutique-screen2.png', '/boutique-screen3.png'],
        description: 'Création d\'un template d\'un site web pour une boutique E-commerce. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-e-commerce',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 4,
        title: 'Template d\'une école en ligne',
        image: ['/ecole-screen1.png', '/ecole-screen2.png', '/ecole-screen3.png'],
        description: 'Création d\'un template d\'un site web pour une école en ligne. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-education',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 5,
        title: 'Template d\'un site d\'évènementiel',
        image: ['/evenementiel-screen1.png', '/evenementiel-screen2.png'],
        description: 'Création d\'un template d\'un site web pour un site d\'évènementiel. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-evenementiel',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 6,
        title: 'Template d\'un média',
        image: ['/media-screen1.png', '/media-screen2.png', '/media-screen3.png'],
        description: 'Création d\'un template d\'un site web pour un média. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-media',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 7,
        title: 'Template d\'un SaaS',
        image: ['/saas-screen1.png', '/saas-screen2.png'],
        description: 'Création d\'un template d\'un site web pour un SaaS. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-saas',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 8,
        title: 'Template d\'une clinique de santé',
        image: ['/clinique-screen1.png', '/clinique-screen2.png', '/clinique-screen3.png'],
        description: 'Création d\'un template d\'un site web pour une clinique de santé. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-sante',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    },
    {
        id: 9,
        title: 'Template d\'un site de streaming',
        image: ['/streaming-screen1.png', '/streaming-screen2.png', '/streaming-screen3.png'],
        description: 'Création d\'un template d\'un site web pour un site de streaming. Projet realisé sur Next.js.',
        github: 'https://github.com/jestercsr/template-streaming',
        tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
        where: 'GitHub'
    }
  ]
}