import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import Badge from '../Badge';
import IconText from '../IconText';

const meta: Meta<typeof IconText> = {
  title: 'components/ui/IconText',
  component: IconText,
  parameters: { layout: 'padded' },
  argTypes: {
    tone: {
      control: { type: 'radio' },
      options: ['none', 'fill', 'outline', 'topicSoft', 'topicSolid'],
    },
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg', 'responsive'] },
    radius: { control: { type: 'radio' }, options: ['pill', 'rounded', 'square'] },
    density: { control: { type: 'radio' }, options: ['tight', 'normal', 'loose'] },
    typo: { control: { type: 'radio' }, options: ['tag', 'caption', 'captionBold'] },
    topic: {
      control: { type: 'radio' },
      options: ['default', 'growth', 'learn', 'challenge', 'connect'],
    },
    icon: {
      control: { type: 'select' },
      options: [
        'alarm',
        'arrow',
        'calendar',
        'check',
        'filter',
        'heart',
        'person',
        'plus',
        'delete',
      ],
    },
    iconPosition: { control: { type: 'radio' }, options: ['leading', 'trailing'] },
    iconColor: { control: 'text' },
    className: {
      control: 'text',
      description:
        'Playground에서 tone - fill/outline tone 선택 시 Gallery에 이미 사용된 색상만 적용 가능',
    },
    as: { control: false, table: { disable: true } },
  },
  args: {
    children: '오늘 21시 마감',
    tone: 'fill',
    topic: 'default',
    icon: 'alarm',
    iconPosition: 'leading',
    iconColor: 'currentColor',
    radius: 'rounded',
    density: 'normal',
    typo: 'captionBold',
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/* Gallery에서 tone - fill/outline 선택 시 bgColor, borderColor를
className으로 커스터마이징 가능하며, 모든 컬러 정상 적용 되나
Playground에서 tone - fill/outline 선택 시에는 Tailwind의 JIT 컴파일 방식 때문에
Gallery에 이미 사용된 색상만 적용됨 */

export const Playground: Story = {
  render: args => <IconText {...args} />,
};

export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10 rounded-xl bg-[var(--color-surface)] p-10">
      {/* topicSolid */}
      <div>
        <div className="caption mb-2 text-[var(--color-gray-500)]">오늘 21시 마감 (topicSolid)</div>
        <div className="flex flex-wrap gap-6">
          {(['growth', 'learn', 'challenge', 'connect'] as const).map(t => (
            <IconText
              key={t}
              icon="alarm"
              tone="topicSolid"
              topic={t}
              radius="rounded"
              className="pr-2 pl-1">
              오늘 21시 마감
            </IconText>
          ))}
        </div>
      </div>

      {/* 필터/정렬 */}
      <div>
        <div className="caption mb-2 text-[var(--color-gray-500)]">필터 / 정렬</div>
        <div className="flex gap-8">
          <IconText icon="arrow" iconPosition="trailing" className="font-medium text-gray-500">
            태그 전체
          </IconText>
          <IconText
            icon="arrow"
            iconPosition="trailing"
            iconColor="var(--color-gray-800)"
            className="font-medium text-gray-800">
            태그 전체
          </IconText>
          <IconText icon="filter" className="font-medium text-gray-600">
            마감임박
          </IconText>
          <IconText
            icon="filter"
            iconColor="var(--color-gray-800)"
            className="font-medium text-gray-800">
            마감임박
          </IconText>
        </div>
      </div>

      {/* 찜한 모임 */}
      <div>
        <div className="caption mb-2 text-[var(--color-gray-500)]">찜한 모임</div>
        <div className="flex items-center gap-8">
          <IconText className="text-purple-500">
            찜한 모임
            <Badge value={1} size="responsive" className="ml-[6px]" />
          </IconText>
          <IconText className="text-gray-400">
            찜한 모임
            <Badge value={1} size="responsive" className="ml-[6px]" />
          </IconText>
        </div>
      </div>

      {/* 이용 상태 */}
      <div>
        <div className="caption mb-2 text-[var(--color-gray-500)]">이용 상태</div>
        <div className="flex flex-wrap items-center gap-6">
          <IconText tone="fill" className="typo-body-sm bg-purple-50 text-purple-600">
            이용 예정
          </IconText>
          <IconText tone="outline" className="typo-body-sm border-gray-500 text-gray-500">
            개설 대기
          </IconText>
          <IconText tone="fill" className="typo-body-sm bg-gray-50 text-gray-500">
            이용 완료
          </IconText>
          <IconText
            tone="outline"
            icon="check"
            className="typo-body-sm border-purple-400 pr-2 pl-1 text-purple-600">
            개설 확정
          </IconText>
        </div>
      </div>
    </div>
  ),
};
