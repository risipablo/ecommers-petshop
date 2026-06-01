// pages/ArticulosPage.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import '../../assets/styles/articulos.css';


interface ArticleImage {
    url: string;
    caption: string;
}

interface Article {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    images: ArticleImage[];
    color: string;
}


const articles: Article[] = [
    {
        id: 1,
        title: 'Alimentación saludable para perros adultos',
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
            { url: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=900&q=80', caption: 'Gato jugando con plumas' },
            { url: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=900&q=80', caption: 'Túnel interactivo' },
            { url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&q=80', caption: 'Ratón de tela artesanal' },
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

const categoryColor: Record<string, string> = {
    Nutrición: '#6d4ba3',
    Juguetes: '#e07b39',
    Higiene: '#2a9d8f',
    Indumentaria: '#c77dff',
    Actividad: '#ef233c',
};

/* ════════════════════════════════════════════════
   SLIDER MODAL
   ════════════════════════════════════════════════ */
const SliderModal = ({ article, onClose }: { article: Article; onClose: () => void }) => {
    const [current, setCurrent] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startX = useRef(0);
    const total = article.images.length;

    const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
    const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [prev, next, onClose]);

    const onPointerDown = (e: React.PointerEvent) => {
        startX.current = e.clientX;
        setDragging(true);
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!dragging) return;
        const diff = e.clientX - startX.current;
        if (diff < -40) next();
        else if (diff > 40) prev();
        setDragging(false);
    };

    return (
        <div
            className="art-modal-overlay"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="art-modal">

                {/* Close */}
                <button className="art-modal-close" onClick={onClose} aria-label="Cerrar">
                    <X size={18} />
                </button>

                {/* Slider */}
                <div
                    className={`art-slider${dragging ? ' dragging' : ''}`}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerLeave={() => setDragging(false)}
                >
                    {article.images.map((img, i) => (
                        <img
                            key={i}
                            src={img.url}
                            alt={img.caption}
                            draggable={false}
                            className={`art-slider-img${i === current ? ' active' : ''}`}
                        />
                    ))}

                    <div className="art-slider-gradient" />

                    <p className="art-slider-caption">{article.images[current].caption}</p>

                    {/* Dots */}
                    <div className="art-slider-dots">
                        {article.images.map((_, i) => (
                            <button
                                key={i}
                                className={`art-dot${i === current ? ' active' : ''}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Imagen ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    {total > 1 && (
                        <>
                            <button className="art-arrow prev" onClick={prev} aria-label="Anterior">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="art-arrow next" onClick={next} aria-label="Siguiente">
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Body */}
                <div className="art-modal-body">
                    <div className="art-modal-tags">
                        <span
                            className="art-modal-badge"
                            style={{
                                background: `${article.color}18`,
                                color: article.color,
                            }}
                        >
                            {article.category}
                        </span>
                        <span className="art-modal-readtime">
                            <Clock size={12} />
                            {article.readTime} de lectura
                        </span>
                    </div>

                    <h2 className="art-modal-title">{article.title}</h2>
                    <p className="art-modal-excerpt">{article.excerpt}</p>

                    {/* Thumbnail strip */}
                    <div className="art-thumbs">
                        {article.images.map((img, i) => (
                            <button
                                key={i}
                                className={`art-thumb${i === current ? ' active' : ''}`}
                                onClick={() => setCurrent(i)}
                                style={i === current ? { outlineColor: article.color } : undefined}
                                aria-label={`Ver imagen ${i + 1}`}
                            >
                                <img src={img.url} alt={img.caption} />
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};


const ArticleCard = ({
    article,
    index,
    onClick,
}: {
    article: Article;
    index: number;
    onClick: () => void;
}) => (
    <article
        className="art-card"
        onClick={onClick}
        style={{ animationDelay: `${index * 0.07}s` }}
    >
        <div className="art-card-cover">
            <img src={article.images[0].url} alt={article.title} />
            <span
                className="art-card-category"
                style={{
                    background: article.color,
                    boxShadow: `0 2px 8px ${article.color}60`,
                }}
            >
                {article.category}
            </span>
            <span className="art-card-photo-count">
                📷 {article.images.length}
            </span>
        </div>

        <div className="art-card-body">
            <div className="art-card-meta">
                <Clock size={12} />
                <span>{article.readTime} de lectura</span>
            </div>

            <h3 className="art-card-title">{article.title}</h3>
            <p className="art-card-excerpt">{article.excerpt}</p>

            <div className="art-card-cta" style={{ color: article.color }}>
                Leer artículo
                <ArrowRight size={14} />
            </div>
        </div>
    </article>
);


export const ArticulosPage = () => {
    const [selected, setSelected] = useState<Article | null>(null);
    const [activeCategory, setActiveCategory] = useState('Todos');

    const categories = ['Todos', ...Array.from(new Set(articles.map(a => a.category)))];

    const filtered = activeCategory === 'Todos'
        ? articles
        : articles.filter(a => a.category === activeCategory);

    return (
        <div className="art-page">
            <div className="art-inner">

                {/* Header */}
                <header className="art-header">
                    
                    <h1>Artículos para tu mascota</h1>
                    <p>Todo lo que necesitás saber para el bienestar, la salud y la felicidad de tu compañero peludo.</p>
                </header>

                {/* Filters */}
                <div className="art-filters">
                    {categories.map(cat => {
                        const active = cat === activeCategory;
                        const color = cat === 'Todos' ? '#6d4ba3' : (categoryColor[cat] || '#6d4ba3');
                        return (
                            <button
                                key={cat}
                                className={`art-filter-btn${active ? ' active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                                style={active ? { background: color, borderColor: color } : undefined}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="art-grid">
                    {filtered.map((article, i) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            index={i}
                            onClick={() => setSelected(article)}
                        />
                    ))}
                </div>

            </div>

            {/* Modal */}
            {selected && (
                <SliderModal
                    article={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
};

export default ArticulosPage;