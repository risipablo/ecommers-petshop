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

import ali1b from "../../assets/images/articulos/alimento1b.png"
import ali2b from "../../assets/images/articulos/alimento2b.png"
import ali3b from "../../assets/images/articulos/alimento3b.png"

import act1b from "../../assets/images/articulos/2/1.png"
import act2b from "../../assets/images/articulos/2/2.png"
import act3b from "../../assets/images/articulos/2/3.png"

import act11b from "../../assets/images/articulos/1/1.png"
import act22b from "../../assets/images/articulos/1/2.png"
import act33b from "../../assets/images/articulos/1/3.png"
import act44b from "../../assets/images/articulos/1/4.png"
import act55b from "../../assets/images/articulos/1/5.png"

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
        id: 4,
        title: '¿Tu mascota siente frio?',
        excerpt: 'Algunas razas son más sensibles al frío que otras. Conocé cómo proteger a tu perro o gato durante el invierno con ropa adecuada y cuidados especiales.',
        category: 'Cuidados',
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
        id: 2,
        title: 'Ropa y accesorios para mascotas en invierno',
        excerpt: 'No sabes que talle es tu perro. Chequea este articulo para sacarte la duda',
        category: 'Indumentaria',
        readTime: '3 min',
        color: '#c77dff',
        images: [
            { url: act11b, caption: 'Perro con abrigo de invierno' },
            {  url: act22b, caption: 'Perro con abrigo de invierno'},
            {  url: act33b, caption: 'Perro con abrigo de invierno'},
            { url: act44b, caption: 'Perro con abrigo de invierno'},
            { url: act55b, caption: 'Perro con abrigo de invierno'}
        ],
    },
    {
        id: 3,
        title: '¿Como ayudar a tu mascota en este invierno?',
        excerpt: 'El invierno trae desafíos para nuestros compañeros. Descubrí cómo adaptar sus paseos, alimentación y espacios de descanso para asegurar que tu mascota se mantenga cálida, saludable y feliz durante los días de frío intenso.',
        category: 'Cuidados',
        readTime: '6 min',
        color: '#2a9d8f',
        images: [
            { url: act1b, caption: '' },
            { url: act2b, caption: '' },
            { url: act3b, caption: '' },
        ],
    },

  {
        id: 5,
        title: 'La Transición Nutricional: ¿Cuándo cambiar su alimento?',
        excerpt: 'Aprende los momentos clave para realizar el cambio de fórmula alimenticia y cómo hacerlo de forma segura para no afectar su sistema digestivo.',
        category: 'Nutrición',
        readTime: '5 min',
        color: '#6d4ba3',
        images: [
            { url: ali1b, caption: 'Alimento balanceado para perros' },
            { url: ali2b, caption: 'Snacks naturales para premios' },
            { url: ali3b, caption: 'Snacks naturales para premios' },
        ],
    },
    {
        id: 6,
        title: 'Ejercicio y actividad física para razas grandes',
        excerpt: 'Los perros de razas grandes necesitan rutinas específicas para cuidar sus articulaciones. Planes de ejercicio adaptados por edad y peso.',
        category: 'Higiene',
        readTime: '7 min',
        color: '#ef233c',
        images: [
            { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80', caption: 'Golden Retriever corriendo' },
            { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=900&q=80', caption: 'Entrenamiento en el parque' },
            { url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=900&q=80', caption: 'Nado terapéutico' },
        ],
    },
];