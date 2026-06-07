import type { Article } from "../../features/types/articulos.types";
import art1 from "../../assets/images/articulos/art1.jpeg"
import art2 from "../../assets/images/articulos/art2.jpeg"
import art3 from "../../assets/images/articulos/art3.jpeg"
import art4 from "../../assets/images/articulos/art4.jpeg"

export const articles: Article[] = [
    {
        id: 1,
        title: 'Alimentación saludable para perros adultoss',
        excerpt: 'Descubrí qué nutrientes son esenciales en cada etapa de la vida de tu perro y cómo elegir el alimento ideal según su raza y tamaño.',
        category: 'Nutrición',
        readTime: '5 min',
        color: '#6d4ba3',
        images: [
            { url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=900&q=80', caption: 'Bowl de comida balanceada' },
            { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80', caption: 'Perro disfrutando su comida' },
            { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80', caption: 'Snacks naturales para premios' },
        ],
    },
    {
        id: 2,
        title: 'Los mejores juguetes para gatos curiosos',
        excerpt: 'Los gatos necesitan estimulación mental y física a diario. Te mostramos los juguetes más recomendados por veterinarios.',
        category: 'Juguetes',
        readTime: '4 min',
        color: '#e07b39',
        images: [
            { url: art1, caption: 'Gato jugando con plumas' },
            { url: art2, caption: 'Túnel interactivo' },
            { url: art3, caption: 'Ratón de tela artesanal' },
            { url: art4, caption: 'Juguete de inteligencia' },
        ],
    },
    {
        id: 3,
        title: 'Guía completa de higiene dental canina',
        excerpt: 'El 80 % de los perros mayores de 3 años tienen problemas bucales. Aprendé a cepillarle los dientes sin estrés y con los productos correctos.',
        category: 'Higiene',
        readTime: '6 min',
        color: '#2a9d8f',
        images: [
            { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80', caption: 'Cepillo dental canino' },
            { url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=900&q=80', caption: 'Veterinario revisando dientes' },
            { url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=900&q=80', caption: 'Productos de higiene bucal' },
        ],
    },
    {
        id: 4,
        title: 'Ropa y accesorios para mascotas en invierno',
        excerpt: 'No todas las razas toleran el frío igual. Conocé las prendas más cómodas para que tu perro o gato pase el invierno abrigado y con estilo.',
        category: 'Indumentaria',
        readTime: '3 min',
        color: '#c77dff',
        images: [
            { url: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=900&q=80', caption: 'Perro con abrigo de invierno' },
            { url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=900&q=80', caption: 'Campera impermeable' },
            { url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=900&q=80', caption: 'Accesorios de temporada' },
        ],
    },
    {
        id: 5,
        title: 'Cómo bañar a tu gato sin drama',
        excerpt: 'El baño de un gato puede ser una odisea… o no. Con la técnica y los productos adecuados, lograrás que sea una experiencia tranquila.',
        category: 'Higiene',
        readTime: '5 min',
        color: '#e9c46a',
        images: [
            { url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=900&q=80', caption: 'Gato en la bañera' },
            { url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=900&q=80', caption: 'Shampoo especial para felinos' },
            { url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=900&q=80', caption: 'Secado con toalla suave' },
        ],
    },
    {
        id: 6,
        title: 'Ejercicio y actividad física para razas grandes',
        excerpt: 'Los perros de razas grandes necesitan rutinas específicas para cuidar sus articulaciones. Planes de ejercicio adaptados por edad y peso.',
        category: 'Actividad',
        readTime: '7 min',
        color: '#ef233c',
        images: [
            { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80', caption: 'Golden Retriever corriendo' },
            { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=900&q=80', caption: 'Entrenamiento en el parque' },
            { url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=900&q=80', caption: 'Nado terapéutico' },
        ],
    },
];