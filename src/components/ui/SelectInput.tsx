'use client';

import { useId, useState } from 'react';

import type { Option } from '@/constants/tags';

import Dropdown from './Dropdown';
import Icon from './Icon';
import { Input } from './Input';

export interface SelectInputProps {
  items: ReadonlyArray<Option>;
  value: Option['value'] | null;
  onChange: (next: Option['value']) => void;
  placeholder?: string;
}

export default function SelectInput({ items, value, onChange, placeholder }: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const listboxId = useId();
  const toggleOpen = () => setOpen(prev => !prev);

  const selectedLabel = items.find(item => item.value === value)?.label ?? '';
  items = items.filter(item => item.location !== '');

  return (
    <div className="relative w-full">
      <div
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={toggleOpen}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        className="cursor-pointer">
        <Input
          placeholder={placeholder}
          value={selectedLabel}
          readOnly
          inputClassName="pointer-events-none caret-transparent selection:bg-transparent"
          rightSlot={
            <button
              type="button"
              aria-label={open ? '옵션 닫기' : '옵션 열기'}
              className="cursor-pointer">
              <Icon name="arrow_dropdown" />
            </button>
          }
        />
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 z-[1000] max-h-64 w-full overflow-y-auto">
          <Dropdown
            items={items}
            onChange={next => {
              onChange(next);
              setOpen(false);
            }}
            onOpenChange={setOpen}
          />
        </div>
      )}
    </div>
  );
}
