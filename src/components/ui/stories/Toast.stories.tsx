import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Toast, useToast } from '../Toast';

const meta: Meta<typeof Toast> = {
  title: 'components/ui/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const ToastTrigger = () => {
  const toast = useToast();
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="rounded bg-green-500 px-4 py-2 text-white"
        onClick={() => toast.showToast('성공적으로 완료되었습니다!', 'success')}>
        Success Toast
      </button>
      <button
        className="rounded bg-red-500 px-4 py-2 text-white"
        onClick={() => toast.showToast('에러가 발생했습니다!', 'error')}>
        Error Toast
      </button>
      <button
        className="rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => toast.showToast('정보를 확인하세요.', 'info')}>
        Info Toast
      </button>

      {/* Toast Component */}
      <Toast />
    </div>
  );
};

export const Default: Story = {
  render: () => <ToastTrigger />,
};
