import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schemaType?: 'WebApplication' | 'FAQPage' | 'AboutPage' | 'ContactPage' | 'WebPage';
  schemaData?: Record<string, any>;
}

export const SeoHead: React.FC<SeoProps> = ({
  title,
  description,
  canonicalPath = '',
  schemaType = 'WebApplication',
  schemaData,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = `${title} | TempMail Plus`;
    document.title = fullTitle;

    // 2. Update Description Meta Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Open Graph Meta
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // 4. Update Schema.org JSON-LD
    const scriptId = 'tempmail-json-ld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${canonicalPath ? `#${canonicalPath}` : ''}` : '';

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: fullTitle,
      description: description,
      url: currentUrl,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      ...schemaData,
    };

    scriptTag.text = JSON.stringify(defaultSchema);
  }, [title, description, canonicalPath, schemaType, schemaData]);

  return null;
};
