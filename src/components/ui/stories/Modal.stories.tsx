import { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useRef, useState } from 'react';

import CreateGroupModal from '@/components/feature/group/CreateGroupModal';
import EditProfileModal from '@/components/feature/my/EditProfileModal';
import EditReviewModal from '@/components/feature/review/WriteReviewModal';

import { ConfirmModal, Modal } from '../Modal';

const meta: Meta<typeof Modal> = {
  title: 'components/ui/Modal',
  component: Modal,
  argTypes: {
    className: {
      control: 'text',
    },
  },
  args: {
    className: 'w-[530px] h-[220px]',
  },
};

export default meta;

type ModalStory = StoryObj<typeof Modal>;

export const ModalPlayground: ModalStory = {
  render: args => {
    const [open, setOpen] = useState(false);
    const okRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setOpen(true)}>
          모달 열기
        </button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          initialFocusRef={okRef as React.RefObject<HTMLElement>}
          className={args.className}>
          <Modal.Header title="모임 만들기" onClose={() => setOpen(false)} />
          <Modal.Body>
            <div className="space-y-3 text-gray-700">
              <p>Controls에서 className 값 변경 가능</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="rounded-md border px-4 py-2 text-sm" onClick={() => setOpen(false)}>
              취소
            </button>
            <button
              ref={okRef}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white"
              onClick={() => setOpen(false)}>
              확인
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

type ConfirmModalStory = StoryObj<typeof ConfirmModal>;

export const ConfirmModalPlayground: ConfirmModalStory = {
  render: args => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setOpen(true)}>
          로그아웃
        </button>

        <ConfirmModal
          open={open}
          onOpenChange={setOpen}
          content={args.content}
          tone="brand"
          onConfirm={() => {}}
        />
      </div>
    );
  },
  argTypes: {
    content: {
      control: { type: 'text' },
    },
  },
  args: {
    content: '로그아웃 하시겠습니까?',
  },
};

type CreateGroupModalStory = StoryObj<typeof CreateGroupModal>;

export const CreateGroupModalPlayground: CreateGroupModalStory = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={() => setOpen(true)}>
          모달
        </button>

        <CreateGroupModal {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  argTypes: {},
  args: {},
};

type EditReviewModalStory = StoryObj<typeof EditReviewModal>;
export const EditReviewModalPlayground: EditReviewModalStory = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={() => setOpen(true)}>
          모달
        </button>

        <EditReviewModal {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  argTypes: {},
  args: {},
};

type EditProfileModalStory = StoryObj<typeof EditProfileModal>;
export const EditProfileModalPlayground: EditProfileModalStory = {
  render: args => {
    const [open, setOpen] = useState(false);
    const user = {
      name: 'test',
      image: '',
      companyName: '개인',
      email: 'test@test.com',
      id: 1,
      createdAt: '',
      updatedAt: '',
    };

    return (
      <>
        <button
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={() => setOpen(true)}>
          모달
        </button>

        <EditProfileModal {...args} user={user} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  argTypes: {},
  args: {},
};
