import Icon from '@/components/ui/Icon';
import IconText from '@/components/ui/IconText';

interface HeaderProps {
  deadlineText: string;
  dateText: string;
  timeText: string;
  topic: 'growth' | 'learn' | 'challenge' | 'connect' | 'default';
  isHost?: boolean;
}

export default function GroupDetailCardHeader({
  deadlineText,
  dateText,
  timeText,
  topic,
  isHost = false,
}: HeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <IconText
          icon="alarm"
          size="sm"
          density="tight"
          tone="topicSolid"
          topic={topic}
          typo="tag"
          radius="rounded"
          className="pr-2 pl-1">
          {deadlineText}
        </IconText>

        <IconText
          tone="outline"
          size="sm"
          density="tight"
          radius="rounded"
          typo="tag"
          className="text-gray-500">
          {dateText}
        </IconText>

        <IconText
          tone="outline"
          size="sm"
          density="tight"
          radius="rounded"
          typo="tag"
          className="text-gray-500">
          {timeText}
        </IconText>
      </div>

      <div className="flex h-8 w-8 items-center justify-center">
        <Icon
          name="crown"
          size={32}
          className={isHost ? 'text-[var(--color-purple-600)]' : 'invisible'}
          aria-hidden={!isHost}
        />
      </div>
    </div>
  );
}
