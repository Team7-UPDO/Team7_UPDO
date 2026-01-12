import { MetadataRoute } from 'next';

const baseUrl = 'https://updo.site';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const teamId = process.env.NEXT_PUBLIC_TEAM_ID;

interface GatheringItem {
  id: number;
  canceledAt?: string;
}

async function fetchAllGatheringIds(): Promise<number[]> {
  if (!apiBaseUrl || !teamId) return [];

  try {
    const res = await fetch(`${apiBaseUrl}/${teamId}/gatherings?limit=100&offset=0`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const gatherings: GatheringItem[] = await res.json();
    return gatherings.filter(g => !g.canceledAt).map(g => g.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gatheringIds = await fetchAllGatheringIds();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gathering`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const gatheringPages: MetadataRoute.Sitemap = gatheringIds.map(id => ({
    url: `${baseUrl}/gathering/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...gatheringPages];
}
