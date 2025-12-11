import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SeoHead Component - SEO & Social Media Optimization
 * 
 * Componente reutilizable para gestionar meta tags de SEO, Open Graph y Twitter Cards.
 * Optimiza la visibilidad en buscadores y la apariencia al compartir en redes sociales.
 * 
 * @param title - Título de la página (se concatena con "Alejo Palavecino")
 * @param description - Descripción para SEO (150-160 caracteres óptimo)
 * @param image - URL de la imagen para Open Graph (1200x630px recomendado)
 * @param url - URL canónica de la página
 * @param type - Tipo de contenido Open Graph (website, article, profile)
 */

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

const DEFAULT_SEO = {
  title: 'Alejo Palavecino | Desarrollador Full Stack & Especialista UI',
  description: 'Portafolio interactivo de Alejo Palavecino. Desarrollador Full Stack experto en React, Node.js y Diseño UI. Explora mis proyectos y habilidades.',
  image: '/og-image.jpg', // Actualizar con la imagen real del portfolio
  url: 'https://alejopalavecino.com', // Actualizar con el dominio real
  author: 'Alejo Palavecino',
  keywords: 'Alejo Palavecino, Full Stack Developer, React Developer, Node.js, TypeScript, UI/UX Design, Web Development, Portfolio',
};

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = DEFAULT_SEO.description,
  image = DEFAULT_SEO.image,
  url = DEFAULT_SEO.url,
  type = 'website',
}) => {
  const pageTitle = title ? `${title} | Alejo Palavecino` : DEFAULT_SEO.title;
  const canonicalUrl = url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={DEFAULT_SEO.keywords} />
      <meta name="author" content={DEFAULT_SEO.author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language */}
      <html lang="es" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Alejo Palavecino Portfolio" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@alejopalavecino" /> {/* Actualizar con tu @ */}

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Theme Color (para mobile) */}
      <meta name="theme-color" content="#0A0E1A" />
      <meta name="msapplication-TileColor" content="#0A0E1A" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Alejo Palavecino',
          jobTitle: 'Full Stack Developer',
          url: canonicalUrl,
          image: image,
          sameAs: [
            'https://www.linkedin.com/in/alejo-palavecino/',
            'https://github.com/AlejoPalavecino',
          ],
          knowsAbout: [
            'React',
            'Node.js',
            'TypeScript',
            'JavaScript',
            'Full Stack Development',
            'UI/UX Design',
            'Web Performance',
          ],
        })}
      </script>
    </Helmet>
  );
};
