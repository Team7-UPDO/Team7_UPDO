import GroupDetailSection from '@/components/feature/gathering/detail/GroupDetailSection';

export const dynamic = 'force-dynamic';

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id } = await params;
  return <GroupDetailSection gatheringId={id} />;
}
