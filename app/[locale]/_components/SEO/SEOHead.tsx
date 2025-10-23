import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  locale?: string;
  alternateLanguages?: Record<string, string>;
  structuredData?: any; // Used for documentation purposes
  noIndex?: boolean;
  noFollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  siteName?: string;
  twitterHandle?: string;
  facebookAppId?: string;
}

export function generateSEOMetadata({
  title = 'Pepagora - Global B2B Marketplace for Manufacturers & Suppliers',
  description = 'Connect with verified manufacturers, suppliers, and exporters worldwide on Pepagora. Source quality products, find business partners, and grow your business in the global marketplace.',
  keywords = 'B2B marketplace, manufacturers, suppliers, exporters, wholesale, global trade, business directory, sourcing, procurement',
  canonicalUrl,
  ogImage = 'https://sandbox.pepagora.org/img/og-default.jpg',
  ogType = 'website',
  locale = 'en',
  alternateLanguages = {},
  structuredData,
  noIndex = false,
  noFollow = false,
  author = 'Pepagora',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  siteName = 'Pepagora',
  twitterHandle = '@pepagora',
  facebookAppId = '688881134183469'
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sandbox.pepagora.org';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  
  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: siteName,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: fullCanonicalUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'ar': `${baseUrl}/ar`,
        'hi': `${baseUrl}/hi`,
        'ta': `${baseUrl}/ta`,
        'x-default': baseUrl,
        ...alternateLanguages,
      },
    },
    openGraph: {
      type: ogType,
      locale: `${locale}_${locale.toUpperCase()}`,
      url: fullCanonicalUrl,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    other: {
      'fb:app_id': facebookAppId,
      'theme-color': '#171A1C',
      'msapplication-TileColor': '#171A1C',
      'msapplication-config': '/browserconfig.xml',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': siteName,
      'application-name': siteName,
      'mobile-web-app-capable': 'yes',
      'msapplication-tooltip': description,
      'msapplication-starturl': '/',
      'msapplication-tap-highlight': 'no',
      'format-detection': 'telephone=no',
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',
      'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
  };

  // Note: Structured data should be added via script tag in the component
  // This is handled in SEOComponent.tsx

  return metadata;
}

// Default structured data for the homepage
export const defaultStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Pepagora',
  description: 'Global B2B marketplace connecting manufacturers, suppliers, and exporters worldwide',
  url: 'https://sandbox.pepagora.org',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://sandbox.pepagora.org/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Pepagora',
    url: 'https://sandbox.pepagora.org',
    logo: {
      '@type': 'ImageObject',
      url: 'https://sandbox.pepagora.org/img/logo.png',
    },
  },
};

// Structured data for category pages
export function generateCategoryStructuredData(categoryName: string, categoryUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Manufacturers & Suppliers`,
    description: `Find verified ${categoryName} manufacturers, suppliers, and exporters on Pepagora`,
    url: `https://sandbox.pepagora.org${categoryUrl}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${categoryName} Products`,
      description: `List of ${categoryName} products and suppliers`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sandbox.pepagora.org',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryName,
          item: `https://sandbox.pepagora.org${categoryUrl}`,
        },
      ],
    },
  };
}

// Structured data for product pages
export function generateProductStructuredData(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Pepagora',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer || 'Pepagora',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      price: product.price || '0',
      seller: {
        '@type': 'Organization',
        name: product.seller || 'Pepagora',
      },
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 0,
    } : undefined,
  };
}
