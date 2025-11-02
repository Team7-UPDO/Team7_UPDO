import { TAG_OPTIONS } from '@/constants';
import { LocationToTag } from '@/utils/mapping';
import { isClosed as checkClosed } from '@/utils/date';

type TopicType = 'growth' | 'learn' | 'challenge' | 'connect' | 'default';

export function useGatheringStatus(
  location: string,
  capacity: number,
  participantCount: number,
  registrationEnd?: string,
) {
  const isFull = participantCount >= capacity;
  const isAllClosed = checkClosed(registrationEnd) || isFull;
  const topic = LocationToTag(location) as TopicType;
  const safeCapacity = Math.max(1, capacity);
  const category = TAG_OPTIONS.find(option => option.value === topic)?.label ?? '';

  return { isFull, isAllClosed, topic, safeCapacity, category };
}
