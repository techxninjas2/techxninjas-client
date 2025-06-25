/**
 * Utility functions for image optimization
 */

export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // For Unsplash images
  if (originalUrl.includes('unsplash.com')) {
    const url = new URL(originalUrl);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format');
    return url.toString();
  }

  // For Picsum images
  if (originalUrl.includes('picsum.photos')) {
    const baseUrl = originalUrl.split('?')[0];
    const params = new URLSearchParams();
    if (quality < 100) params.set('blur', '1');
    return `${baseUrl}${params.toString() ? '?' + params.toString() : ''}`;
  }

  return originalUrl;
};

const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280]
): string => {
  return sizes
    .map(size => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(', ');
};

const getImageSizes = (
  breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 768px)': '50vw',
    '(max-width: 1024px)': '33vw',
    default: '25vw'
  }
): string => {
  const sizeEntries = Object.entries(breakpoints);
  const mediaQueries = sizeEntries
    .filter(([key]) => key !== 'default')
    .map(([query, size]) => `${query} ${size}`)
    .join(', ');
  
  const defaultSize = breakpoints.default || '100vw';
  return mediaQueries ? `${mediaQueries}, ${defaultSize}` : defaultSize;
};