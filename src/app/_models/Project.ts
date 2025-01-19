import { Tag } from "./Tag";

export interface Project {
    id: number;
    nom: string;
    sommaire: string;
    description: string;
    image: string[];
    tags: Tag[];
    projectLink: string;
    where: string;
    titre: string;
}