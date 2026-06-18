// constants/articulos.constants.ts

import { articles } from "../data/articles";


export const categoryColor: Record<string, string> = {
    Nutrición: '#6d4ba3',
    Juguetes: '#e07b39',
    Higiene: '#2a9d8f',
    Indumentaria: '#c77dff',
    Cuidados: '#ef233c',
};

export const categories = ['Todos', ...Array.from(new Set(articles.map(a => a.category)))];