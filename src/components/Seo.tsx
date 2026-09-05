import { useEffect } from 'react';
import type { SeoConfig } from '@/lib/seo';
import { buildSeo, personSchema, organizationSchema, professionalServiceSchema } from '@/lib/seo';
import { useCms } from '@/lib/cms-store';

export function Seo({ config }: { config: SeoConfig }) {
  const { state } = useCms();
  const seo = buildSeo({
    ...config,
    author: config.author || state?.settings?.authorDefault || 'Kel Nnorom',
    ogImage: config.ogImage || state?.settings?.defaultOgImageUrl || 'https://www.kelnnorom.com/og-image.jpg',
  });

  useEffect(() => {
    document.title = seo.title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Primary Meta Tags
    setMeta('description', seo.description);
    if (seo.keywords && seo.keywords.length > 0) {
      setMeta('keywords', seo.keywords.join(', '));
    }
    setMeta('author', seo.author || 'Kel Nnorom');
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Search Engine Verification Tags (from Superadmin CMS Settings)
    if (state?.settings?.googleSiteVerification) {
      setMeta('google-site-verification', state.settings.googleSiteVerification);
    }
    if (state?.settings?.bingSiteVerification) {
      setMeta('msvalidate.01', state.settings.bingSiteVerification);
    }

    // OpenGraph Tags
    setMeta('og:title', seo.ogTitle, 'property');
    setMeta('og:description', seo.ogDescription, 'property');
    setMeta('og:image', seo.ogImage, 'property');
    setMeta('og:type', seo.ogType, 'property');
    setMeta('og:url', seo.ogUrl, 'property');
    setMeta('og:site_name', state?.settings?.siteName ? `${state.settings.siteName} Executive Portal` : 'Kel Nnorom Executive Portal', 'property');
    setMeta('og:locale', 'en_US', 'property');

    // Twitter Tags
    setMeta('twitter:card', seo.twitterCard);
    setMeta('twitter:site', '@Kelnnorom');
    setMeta('twitter:creator', '@Kelnnorom');
    setMeta('twitter:title', seo.ogTitle);
    setMeta('twitter:description', seo.ogDescription);
    setMeta('twitter:image', seo.twitterImage);

    // Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo.canonical);

    // Update Favicon links dynamically
    if (state?.settings?.faviconUrl) {
      const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      iconLinks.forEach((link) => {
        link.href = state.settings.faviconUrl!;
      });
    }
    if (state?.settings?.faviconAppleTouchUrl) {
      const appleLinks = document.querySelectorAll<HTMLLinkElement>("link[rel='apple-touch-icon']");
      appleLinks.forEach((link) => {
        link.href = state.settings.faviconAppleTouchUrl!;
      });
    }

    // JSON-LD Structured Data
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach((s) => s.remove());

    const shouldIncludeSchema = state?.settings?.enableStructuredSchema !== false;
    if (shouldIncludeSchema) {
      const allSchemas = [
        personSchema,
        organizationSchema,
        professionalServiceSchema,
        ...(seo.jsonLd || []),
      ];

      allSchemas.forEach((schema) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }
  }, [seo, state?.settings]);

  return null;
}
