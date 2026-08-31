import { useEffect } from 'react';
import type { SeoConfig } from '@/lib/seo';
import { buildSeo, personSchema } from '@/lib/seo';

export function Seo({ config }: { config: SeoConfig }) {
  const seo = buildSeo(config);

  useEffect(() => {
    document.title = seo.title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', seo.description);
    setMeta('og:title', seo.ogTitle, 'property');
    setMeta('og:description', seo.ogDescription, 'property');
    setMeta('og:image', seo.ogImage, 'property');
    setMeta('og:type', seo.ogType, 'property');
    setMeta('og:url', seo.ogUrl, 'property');
    setMeta('twitter:card', seo.twitterCard);
    setMeta('twitter:image', seo.twitterImage);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo.canonical);

    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach((s) => s.remove());

    const allSchemas = [personSchema, ...(seo.jsonLd || [])];
    allSchemas.forEach((schema) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [seo]);

  return null;
}
