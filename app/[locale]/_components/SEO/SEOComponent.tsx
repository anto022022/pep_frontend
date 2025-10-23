'use client';

import { useEffect } from 'react';
import { generateCategoryStructuredData, generateProductStructuredData } from './SEOHead';

interface SEOComponentProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  locale?: string;
  structuredData?: any;
  noIndex?: boolean;
  noFollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  categoryData?: any;
  productData?: any;
}

export default function SEOComponent({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  locale = 'en',
  structuredData,
  noIndex = false,
  noFollow = false,
  author = 'Pepagora',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  categoryData,
  productData,
}: SEOComponentProps) {
  
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
    
    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }
    
    // Update canonical URL
    if (canonicalUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sandbox.pepagora.org';
      const fullCanonicalUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`;
      
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', fullCanonicalUrl);
      } else {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', fullCanonicalUrl);
        document.head.appendChild(canonical);
      }
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };
    
    if (title) updateOGTag('og:title', title);
    if (description) updateOGTag('og:description', description);
    if (canonicalUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sandbox.pepagora.org';
      const fullUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`;
      updateOGTag('og:url', fullUrl);
    }
    if (ogImage) updateOGTag('og:image', ogImage);
    updateOGTag('og:type', ogType);
    updateOGTag('og:locale', `${locale}_${locale.toUpperCase()}`);
    updateOGTag('og:site_name', 'Pepagora');
    
    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (twitterTag) {
        twitterTag.setAttribute('content', content);
      } else {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        twitterTag.setAttribute('content', content);
        document.head.appendChild(twitterTag);
      }
    };
    
    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:site', '@pepagora');
    updateTwitterTag('twitter:creator', '@pepagora');
    if (title) updateTwitterTag('twitter:title', title);
    if (description) updateTwitterTag('twitter:description', description);
    if (ogImage) updateTwitterTag('twitter:image', ogImage);
    
    // Update robots meta tag
    const robotsContent = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`;
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (robotsTag) {
      robotsTag.setAttribute('content', robotsContent);
    } else {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      robotsTag.setAttribute('content', robotsContent);
      document.head.appendChild(robotsTag);
    }
    
    // Add structured data
    let finalStructuredData = structuredData;
    
    if (categoryData && !finalStructuredData) {
      finalStructuredData = generateCategoryStructuredData(
        categoryData.name,
        categoryData.liveUrl || `/c/${categoryData.uniqueId}`
      );
    }
    
    if (productData && !finalStructuredData) {
      finalStructuredData = generateProductStructuredData(productData);
    }
    
    if (finalStructuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(finalStructuredData);
      document.head.appendChild(script);
    }
    
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    locale,
    structuredData,
    noIndex,
    noFollow,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    categoryData,
    productData,
  ]);
  
  return null; // This component doesn't render anything
}

// Hook for easy SEO management
export function useSEO(seoProps: SEOComponentProps) {
  useEffect(() => {
    // This will be handled by the SEOComponent
  }, [seoProps]);
  
  return seoProps;
}
