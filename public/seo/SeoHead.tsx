import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'TechXNinjas - Empowering Tech Enthusiasts',
  description = 'Your gateway to hackathons, tech challenges, inspiring speakers, and innovation. We empower tech enthusiasts across India.',
  canonicalUrl = 'https://techxninjas.com',
  ogType = 'website',
  ogImage = 'https://techxninjas.com/images/og-image.jpg',
  twitterCard = 'summary_large_image'
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SeoHead;