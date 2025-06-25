/**
 * SEO utility functions for optimizing page metadata
 */

// Generate meta description from content
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  if (!content) return '';
  
  // Strip HTML tags if present
  const strippedContent = content.replace(/<[^>]*>?/gm, '');
  
  // Truncate to maxLength and add ellipsis if needed
  if (strippedContent.length <= maxLength) {
    return strippedContent;
  }
  
  // Try to cut at a sentence or word boundary
  let truncated = strippedContent.substring(0, maxLength);
  
  // Find the last sentence end
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > maxLength * 0.7) {
    // If we have a sentence end that's at least 70% into the text, use that
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  // Otherwise find the last space
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }
  
  return `${truncated}...`;
};

// Generate canonical URL
export const getCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://techxninjas.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Generate page title with brand
export const formatPageTitle = (title: string, includeBrand: boolean = true): string => {
  const brandName = 'TechXNinjas';
  return includeBrand ? `${title} | ${brandName}` : title;
};

// Generate Open Graph image URL
export const getOgImageUrl = (type: 'event' | 'article' | 'course' | 'profile', slug: string): string => {
  return `https://techxninjas.com/api/og-image?type=${type}&slug=${slug}`;
};

// Generate breadcrumb data for structured data
export const generateBreadcrumbData = (items: {name: string, url: string}[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// Generate keywords from tags and content
export const generateKeywords = (tags: string[], additionalKeywords: string[] = []): string => {
  const allKeywords = [...tags, ...additionalKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];
  return uniqueKeywords.join(', ');
};