import { Injectable } from '@angular/core';
import { Templates } from '../_models/Templates';
import { Tag } from '../_models/Tag';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  templates: Templates[] = [
    {
      id: 0,
      title: "Template d'une Agence",
      image: [
        '/template/agence-screen1.webp',
        '/template/agence-screen2.webp',
        '/template/agence-screen3.webp',
      ],
      description:
        "Création d'un template d'un site web pour une agence. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-agence',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 1,
      title: "Template d'un Blog",
      image: [
        '/template/blog-screen1.webp',
        '/template/blog-screen2.webp',
        '/template/blog-screen3.webp',
      ],
      description:
        "Création d'un template d'un site web pour un blog. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-blog',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 2,
      title: "Template d'un Portfolio",
      image: [
        '/template/portfolio-template1.webp',
        '/template/portfolio-template2.webp',
        '/template/portfolio-template3.webp',
        '/template/portfolio-template4.webp',
        '/template/portfolio-template5.webp',
      ],
      description:
        "Création d'un template d'un site web pour montrer ces projets et ces connaissances. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-portfolio',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 3,
      title: "Template d'une boutique E-commerce",
      image: [
        '/template/boutique-screen1.webp',
        '/template/boutique-screen2.webp',
        '/template/boutique-screen3.webp',
      ],
      description:
        "Création d'un template d'un site web pour une boutique E-commerce. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-e-commerce',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 4,
      title: "Template d'une école en ligne",
      image: [
        '/template/ecole-screen1.webp',
        '/template/ecole-screen2.webp',
        '/template/ecole-screen3.webp',
      ],
      description:
        "Création d'un template d'un site web pour une école en ligne. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-education',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 5,
      title: "Template d'un site d'évènementiel",
      image: [
        '/template/evenementiel-screen1.webp',
        '/template/evenementiel-screen2.webp',
        '/template/evenementiel-screen3.webp',
      ],
      description:
        "Création d'un template d'un site web pour un site d'évènementiel. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-evenementiel',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 6,
      title: "Template d'un média",
      image: [
        '/template/media-screen1.webp',
        '/template/media-screen2.webp',
        '/template/media-screen3.webp',
      ],
      description:
        "Création d'un template d'un site web pour un média. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-media',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 7,
      title: "Template d'un SaaS",
      image: [
        '/template/saas-screen1.webp',
        '/template/saas-screen2.webp',
        '/template/saas-screen3.webp',
        '/template/saas-screen4.webp',
      ],
      description:
        "Création d'un template d'un site web pour un SaaS. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-saas',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 8,
      title: "Template d'une clinique de santé",
      image: [
        '/template/clinique-screen1.webp',
        '/template/clinique-screen2.webp',
        '/template/clinique-screen3.webp',
        '/template/clinique-screen4.webp',
      ],
      description:
        "Création d'un template d'un site web pour une clinique de santé. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-sante',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
    {
      id: 9,
      title: "Template d'un site de streaming",
      image: [
        '/template/streaming-screen1.webp',
        '/template/streaming-screen2.webp',
        '/template/streaming-screen3.webp',
        '/template/streaming-screen4.webp',
      ],
      description:
        "Création d'un template d'un site web pour un site de streaming. Projet realisé sur Next.js.",
      github: 'https://github.com/jestercsr/template-streaming',
      tags: [Tag.NEXTJS, Tag.TAILWINDCSS],
      where: 'GitHub',
    },
  ];
}
