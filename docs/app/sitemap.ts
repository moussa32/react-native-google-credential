import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const docsPages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: new URL(page.url, siteUrl).href,
    changeFrequency: 'monthly',
    priority: page.url === '/docs' ? 0.9 : 0.7,
  }));

  return [
    {
      url: new URL('/', siteUrl).href,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...docsPages,
  ];
}
