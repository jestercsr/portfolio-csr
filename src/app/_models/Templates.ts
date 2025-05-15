import { Tag } from "./Tag";

export interface Templates {
    id: number;
    title: string;
    image: string[];
    description: string;
    github: string;
    tags: Tag[];
    where: string;
}