import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { topicBgSoft, topicBgSolid, topicText } from '@/styles/variants';
import { cn } from '@/utils/cn';

import Icon from './Icon';

/* ─────────────── Icon Meta ─────────────── */
const iconMeta = {
  alarm: { size: 20 },
  arrow: { size: 16 },
  arrow_dropdown: { size: 24, direction: 'down' as const },
  calendar: { size: 20 },
  check: { size: 20 },
  crown: { size: 32 },
  delete: { size: 24 },
  edit: { size: 20 },
  edit_btn: { size: 40 },
  filter: { size: 20 },
  heart: { size: 24, fill: 'lined' as const },
  logout: { size: 20 },
  person: { size: 16 },
  plus: { size: 32 },
  visibility_off: { size: 20 },
  visibility_on: { size: 20 },
  category_tab1: { size: 32 },
  category_tab2: { size: 32 },
  save_filled: { size: 40 },
  save_outline: { size: 40 },
  save: { size: 48 },
} as const;

type IconName = keyof typeof iconMeta;
export type Topic = 'default' | 'growth' | 'learn' | 'challenge' | 'connect';

/* ─────────────── Styles ─────────────── */
const styles = cva(
  'inline-flex items-center align-middle gap-1.5 transition-colors select-none whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'h-5',
        md: 'h-6',
        lg: 'h-7',
      },
      radius: {
        pill: 'chip-full',
        rounded: 'chip-rounded',
        square: 'chip-square',
      },
      tone: {
        none: '',
        fill: '', // className으로 색상 직접 지정 (예: bg-purple-50 text-purple-600)
        outline: 'border text-[var(--color-gray-700)]', // border만, bg는 별도 처리
        topicSoft: '',
        topicSolid: '',
      },
      density: {
        tight: 'px-2 py-0',
        normal: 'px-3 py-[2px]',
        loose: 'px-4 py-[4px]',
      },
      typo: {
        tag: 'tag',
        caption: 'caption',
        captionBold: 'caption-bold',
      },
    },
    defaultVariants: {
      size: 'md',
      radius: 'pill',
      tone: 'none',
      density: 'normal',
      // typo는 defaultVariants에서 제외 (조건부로 기본 타이포 적용)
    },
  },
);

type StyleProps = VariantProps<typeof styles>;

interface IconTextProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'>,
    StyleProps {
  as?: React.ElementType;
  icon?: IconName | React.ReactElement;
  iconPosition?: 'leading' | 'trailing';
  iconColor?: string;
  topic?: Topic;

  children: React.ReactNode;
}

export default function IconText({
  as = 'span',
  size = 'md',
  radius,
  tone,
  density,
  typo,
  icon,
  iconPosition = 'leading',
  iconColor,
  topic = 'default',
  className,
  children,
  ...rest
}: IconTextProps) {
  const Comp: React.ElementType = as;

  // topic 스타일 (topicSoft, topicSolid일 때만 적용)
  const topicClasses =
    tone === 'topicSoft'
      ? cn(topicBgSoft({ topic }), topicText({ topic }))
      : tone === 'topicSolid'
        ? cn(topicBgSolid({ topic }), 'text-white')
        : '';

  // outline 기본 스타일 (className으로 덮어쓰기 가능)
  const outlineDefaults = tone === 'outline' ? 'bg-white border-[var(--color-gray-300)]' : '';

  const dynamicStyles = cn(
    styles({ size, radius, tone, density, typo }),
    outlineDefaults, // outline 기본 스타일 (bg-white, border-gray)
    topicClasses,
    className,
  );

  const renderIcon = (icon?: IconName | React.ReactElement) => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      const meta = iconMeta[icon];
      const iconElement = <Icon name={icon} {...meta} aria-hidden />;

      if (iconColor) {
        return (
          <span
            style={{ color: iconColor }}
            className="inline-flex [&_svg_circle[fill]]:!fill-[currentColor] [&_svg_path[fill]]:!fill-[currentColor] [&_svg_path[stroke]]:!stroke-[currentColor]">
            {iconElement}
          </span>
        );
      }
      return iconElement;
    }
    return icon;
  };

  return (
    <Comp className={dynamicStyles} {...rest}>
      {iconPosition === 'leading' && renderIcon(icon)}
      <span>{children}</span>
      {iconPosition === 'trailing' && renderIcon(icon)}
    </Comp>
  );
}
