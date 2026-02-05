import { Meta, StoryObj } from '@storybook/nextjs-vite';

import DatetimeInput from '../DatetimeInput';
import Icon from '../Icon';
import { Input } from '../Input';
import SelectInput from '../SelectInput';

const meta: Meta<typeof Input> = {
  title: 'components/ui/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: 'radio',
      options: ['lg', 'sm'],
    },
    errorMessage: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
  args: {
    inputSize: 'lg',
    placeholder: '내용을 입력하세요',
    errorMessage: '',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  render: args => {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <Input {...args} />
        </div>
        <div>
          <Input type="password" {...args} />
        </div>
        <div>
          <Input
            {...args}
            placeholder="캘린더 슬롯 예시"
            rightSlot={
              <button
                type="button"
                aria-label="달력 열기"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => {}}>
                <Icon name="calendar" />
              </button>
            }
            readOnly
          />
        </div>
      </div>
    );
  },
};

type SelectInputStory = StoryObj<typeof SelectInput>;

export const SelectInputBoard: SelectInputStory = {
  render: args => (
    <div className="flex w-[474px] flex-col gap-4">
      <SelectInput {...args} />
    </div>
  ),
  argTypes: {
    items: {
      control: { type: 'object' },
      description: '드롭다운에 표시할 항목 배열 (label, value)',
    },
  },
  args: {
    items: [
      { label: '성장', value: 'growth', location: '건대입구' },
      { label: '배움', value: 'learn', location: '을지로3가' },
      { label: '도전', value: 'challenge', location: '신림' },
      { label: '연결', value: 'connect', location: '홍대입구' },
    ],
  },
};

type CalendarStory = StoryObj<typeof DatetimeInput>;

export const DatetimeInputBoard: CalendarStory = {
  render: args => (
    <div className="flex w-[217px] flex-col gap-4">
      <DatetimeInput {...args} />
    </div>
  ),
  argTypes: {
    value: {
      control: { type: 'date' },
      description: '선택된 날짜 (Date 객체)',
    },
  },
  args: {
    value: undefined,
  },
};
