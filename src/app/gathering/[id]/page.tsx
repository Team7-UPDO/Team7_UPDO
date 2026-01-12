import { Metadata } from 'next';
import GroupDetailSection from '@/components/feature/gathering/detail/GroupDetailSection';

export const dynamic = 'force-dynamic';

const baseUrl = 'https://updo.site';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const teamId = process.env.NEXT_PUBLIC_TEAM_ID;

interface GatheringDetail {
  id: number;
  name: string;
  type: string;
  location: string;
  image?: string;
}

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GroupDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!apiBaseUrl || !teamId) {
    return {
      title: '모임 상세',
      description: 'UPDO에서 다양한 성장 모임을 만나보세요.',
    };
  }

  try {
    const res = await fetch(`${apiBaseUrl}/${teamId}/gatherings/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: '모임 상세',
        description: 'UPDO에서 다양한 성장 모임을 만나보세요.',
      };
    }

    const gathering: GatheringDetail = await res.json();
    const title = `${gathering.name} | UPDO`;
    const description = `${gathering.location}에서 진행되는 ${gathering.type} 모임. UPDO에서 함께 성장하세요.`;

    return {
      title: gathering.name,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/gathering/${id}`,
        siteName: 'UPDO',
        images: gathering.image
          ? [{ url: gathering.image, width: 600, height: 315, alt: gathering.name }]
          : [{ url: '/images/og_default.webp', width: 600, height: 315, alt: 'UPDO' }],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: gathering.image ? [gathering.image] : ['/images/og_default.webp'],
      },
    };
  } catch {
    return {
      title: '모임 상세',
      description: 'UPDO에서 다양한 성장 모임을 만나보세요.',
    };
  }
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id } = await params;
  return <GroupDetailSection gatheringId={id} />;
}
