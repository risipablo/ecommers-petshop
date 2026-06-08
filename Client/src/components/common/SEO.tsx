// components/common/SEO.tsx
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  author?: string
  noIndex?: boolean
}

export const SEO = ({
  title = 'Bambina Petshop - Todo para tu mascota',
  description = 'Encuentra alimentos premium, accesorios, juguetes y productos de higiene para perros y gatos. Envíos a todo el país. ¡Calidad y amor para tu mejor amigo!',
  keywords = 'petshop, alimentos para perros, alimentos para gatos, accesorios para mascotas, juguetes para perros, higiene para mascotas',
  image = 'https://bambinapetshop.com/og-image.jpg',
  url = 'https://ecommers-petshop.vercel.app',
  type = 'website',
  publishedTime,
  author = 'Bambina Petshop',
  noIndex = false
}: SEOProps) => {
  const siteTitle = 'Bambina Petshop'
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`

  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Control de indexación */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      
      {/* Product specific */}
      {type === 'product' && (
        <meta property="og:type" content="product" />
      )}
      
      {/* Verificación de Google (opcional) */}
      {/* <meta name="google-site-verification" content="TU_CODIGO" /> */}
      
      {/* Idioma */}
      <meta http-equiv="Content-Language" content="es" />
      <html lang="es" />
      
      {/* Vista previa de WhatsApp (mejora) */}
      <meta property="og:locale" content="es_AR" />
    </Helmet>
  )
}