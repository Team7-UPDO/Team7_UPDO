import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tab, { type TabItem } from '../Tab';

const meta: Meta<typeof Tab> = {
  title: 'components/ui/Tab',
  component: Tab,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '탭 네비게이션 컴포넌트. 하단 인디케이터가 슬라이드하며 이동',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '현재 선택된 탭 값',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Preview: Story = {
  parameters: { controls: { disable: true } },
  args: { fullWidth: true },
  render: (args: React.ComponentProps<typeof Tab>) => {
    const [value1, setValue1] = useState(args.value ?? 'growth');
    const [value2, setValue2] = useState('myMeetings');

    // 홈: 아이콘 있는 탭
    const tabItems: TabItem<'growth' | 'networking'>[] = [
      {
        value: 'growth',
        label: '성장',
        icon: 'category_tab1',
        content: <div>성장 카테고리 컨텐츠</div>,
      },
      {
        value: 'networking',
        label: '네트워킹',
        icon: 'category_tab2',
        content: <div>네트워킹 카테고리 컨텐츠</div>,
      },
    ];

    // 마이페이지: 아이콘 없는 탭
    const myPageTabs: TabItem<'myMeetings' | 'myReviews' | 'created'>[] = [
      { value: 'myMeetings', label: '나의 모임', content: <div>나의 모임</div> },
      { value: 'myReviews', label: '나의 리뷰', content: <div>나의 리뷰</div> },
      { value: 'created', label: '내가 만든 모임', content: <div>내가 만든 모임</div> },
    ];

    return (
      <div className="flex flex-col gap-10">
        {/* ── 아이콘 있는 버전 ── */}
        <section>
          <h3 className="section-title mb-4">아이콘 있는 탭</h3>
          <Tab {...args} items={tabItems} value={value1} onChange={setValue1} />
        </section>

        {/* ── 아이콘 없는 버전 ── */}
        <section>
          <h3 className="section-title mb-4">아이콘 없는 탭</h3>
          <Tab {...args} items={myPageTabs} value={value2} onChange={setValue2} />
        </section>
      </div>
    );
  },
};
