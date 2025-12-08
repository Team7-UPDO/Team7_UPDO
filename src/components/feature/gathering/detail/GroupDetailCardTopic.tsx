import Tag from '@/components/ui/Tag';

interface TopicProps {
  name: string;
  category: string;
  topic: 'growth' | 'learn' | 'challenge' | 'connect' | 'default';
}

export default function GroupDetailCardTopic({ name, category, topic }: TopicProps) {
  return (
    <div>
      <h1 className="typo-title text-[var(--color-gray-900)]">{name}</h1>
      <div className="mt-3">
        <Tag label={category} topic={topic} />
      </div>
    </div>
  );
}
