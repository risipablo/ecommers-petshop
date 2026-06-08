import type { Article } from "../../features/types/articulos.types";
import art1 from "../../assets/images/articulos/art1.jpeg"
import art2 from "../../assets/images/articulos/art2.jpeg"
import art3 from "../../assets/images/articulos/art3.jpeg"
import art4 from "../../assets/images/articulos/art4.jpeg"

import ali1 from "../../assets/images/articulos/alimento1.png"
import ali2 from "../../assets/images/articulos/alimento2.png"
import ali3 from "../../assets/images/articulos/alimento3.png"
import ali4 from "../../assets/images/articulos/alimento4.png"
import ali5 from "../../assets/images/articulos/alimento5.png"
import ali6 from "../../assets/images/articulos/alimento6.png"

export const articles: Article[] = [
    {
        id: 1,
        title: 'Alimentación ideal para perros: Guía por etapas de vida',
        excerpt: 'La nutrición de tu perro es clave para su salud. Descubrí qué alimentos son mejores para cachorros, adultos y seniors, y cómo elegir el balanceado adecuado.',
        category: 'Nutrición',
        readTime: '5 min',
        color: '#6d4ba3',
        images: [
            { url: ali1, caption: 'Alimento balanceado para perros' },
            { url: ali2, caption: 'Snacks naturales para premios' },
            { url: ali3, caption: 'Snacks naturales para premios' },
            { url: ali4, caption: 'Alimento húmedo para perros' },
            { url: ali5, caption: 'Alimento húmedo para perros' },
            { url: ali6, caption: 'Alimento húmedo para perros' },
        ],
    },
    {
        id: 2,
        title: '¿Tu mascota siente frio?',
        excerpt: 'Algunas razas son más sensibles al frío que otras. Conocé cómo proteger a tu perro o gato durante el invierno con ropa adecuada y cuidados especiales.',
        category: 'Indumentaria',
        readTime: '5 min',
        color: '#c77dff',
        images: [
            { url: art1, caption: '' },
            { url: art2, caption: '' },
            { url: art3, caption: '' },
            { url: art4, caption: '' },
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