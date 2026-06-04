// types/articulos.types.ts
export interface ArticleImage {
    url: string;
    caption: string;
}

export interface Article {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    images: ArticleImage[];
    color: string;
}

export interface ArticleCardProps {
    article: Article;
    index: number;
    onClick: () => void;
}

export interface SliderModalProps {
    article: Article;
    onClose: () => void;
}