// components/articulos/ArticleCard.tsx
import { Clock, ArrowRight } from 'lucide-react';
import type { ArticleCardProps } from '../../features/types/articulos.types';


export const ArticleCard = ({ article, index, onClick }: ArticleCardProps) => (
    <article
        className="art-card"
        onClick={onClick}
        style={{ animationDelay: `${index * 0.07}s` }}
    >
        <div className="art-card-cover">
            <img src={article.images[0].url} alt={article.title} />
            <span
                className="art-card-category"
                style={{ background: article.color, boxShadow: `0 2px 8px ${article.color}60` }}
            >
                {article.category}
            </span>
            <span className="art-card-photo-count">📷 {article.images.length}</span>
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