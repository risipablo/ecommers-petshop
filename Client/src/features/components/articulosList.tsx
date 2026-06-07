// pages/ArticulosPage.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { articles } from '../../components/data/articles';
import { categoryColor, categories } from '../../components/constants/articulos.constants';
import type { Article } from '../types/articulos.types';
import '../../assets/styles/articulos.css';
import { ArticleCard } from '../../components/articulos/articleCard';
import { SliderModal } from '../../components/articulos/sliderModal';

export const ArticulosPage = () => {
    const location = useLocation();
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [activeCategory, setActiveCategory] = useState('Todos');

    // Filtrar artículos por categoría
    const filteredArticles = activeCategory === 'Todos'
        ? articles
        : articles.filter(article => article.category === activeCategory);

    // Scroll to top al cambiar de página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname, activeCategory]);

    return (
        <div className="art-page">
            <div className="art-inner">
                {/* Header */}
                <header className="art-header">
                    <h1>Artículos</h1>
                    <p>Todo lo que necesitás saber para el bienestar, la salud y la felicidad de tu compañero peludo.</p>
                </header>

                {/* Filtros por categoría */}
                <div className="art-filters">
                    {categories.map(category => {
                        const isActive = category === activeCategory;
                        const color = category === 'Todos' ? '#6d4ba3' : (categoryColor[category] || '#6d4ba3');
                        return (
                            <button
                                key={category}
                                className={`art-filter-btn ${isActive ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                                style={isActive ? { background: color, borderColor: color } : undefined}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* Grid de artículos */}
                <div className="art-grid">
                    {filteredArticles.map((article, index) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            index={index}
                            onClick={() => setSelectedArticle(article)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal de slider */}
            {selectedArticle && (
                <SliderModal
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                />
            )}
        </div>
    );
};

export default ArticulosPage;