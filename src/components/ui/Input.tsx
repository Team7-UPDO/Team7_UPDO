'use client';
import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';
import { type VariantProps, cva } from 'class-variance-authority';

import Icon from './Icon';

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  rightSlot?: React.ReactNode;
  disableFocusStyle?: boolean;

  multiline?: boolean;
  rows?: number;
  autoResize?: boolean;

  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const INPUT_VARIANT = {
  default: 'border border-gray-50',
  toggle: 'border border-gray-50', // dropdown 완성 후 추가 개발
  typing: 'border-[1px] border-purple-400',
  done: 'border-[1px] border-gray-50',
};

const inputVariants = cva(
  'flex items-center w-full rounded-md px-4 py-2.5 outline-none transition active:border-purple-400 hover:border-purple-150 text-gray-700 bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: INPUT_VARIANT,
      inputSize: {
        lg: 'typo-base leading-6',
        sm: 'typo-sm leading-5',
      },
      isError: {
        true: 'border-[1px] border-red-500 text-gray-700',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'lg',
      isError: false,
    },
  },
);

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      inputSize,
      type,
      errorMessage,
      className,
      inputClassName,
      rightSlot,
      disableFocusStyle,
      multiline,
      rows,
      autoResize,
      ...props
    },
    ref,
  ) => {
    // 안전한 Props 사용 : Input Focus Handler 관련
    const { onFocus, onBlur, onChange, ...domRestProps } = props;

    // 안전한 Props 사용 : TextArea 사용 관련
    const textareaSafeProps: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
      id: props.id,
      name: (props as ComponentPropsWithoutRef<'textarea'>).name,
      placeholder: props.placeholder,
      disabled: props.disabled,
      value: props.value as string | number | readonly string[] | undefined,
      defaultValue: props.defaultValue as string | number | readonly string[] | undefined,
      maxLength: (props as ComponentPropsWithoutRef<'textarea'>).maxLength,
      minLength: (props as ComponentPropsWithoutRef<'textarea'>).minLength,
      required: props.required,
      readOnly: props.readOnly,
    };

    const isPasswordField = !multiline && type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    const isError = !!errorMessage?.trim();
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(!!(props.value ?? props.defaultValue));

    // textArea ref 설정 및 관리
    const innerRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
    const setRefs = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref && typeof ref !== 'function' && 'current' in ref) {
        (ref as { current: HTMLInputElement | HTMLTextAreaElement | null }).current = el;
      }
    };

    // textArea 기능 중 Auto-resize
    useEffect(() => {
      if (!multiline || !autoResize) return;
      const el = innerRef.current as HTMLTextAreaElement | null;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [multiline, autoResize, props.value, props.defaultValue]);

    // 자동으로 입력란 포커스 스타일 조절
    const currentVariant = disableFocusStyle
      ? isFilled
        ? 'done'
        : 'default'
      : isFocused
        ? 'typing'
        : isFilled
          ? 'done'
          : 'default';

    // 외부에서 값이 업데이트되어도 setIsFilled가 바뀔 수 있도록 수정
    useEffect(() => {
      setIsFilled(!!(props.value ?? props.defaultValue));
    }, [props.value, props.defaultValue]);

    const errorId = props.id ? `${props.id}-error` : undefined;

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    return (
      <>
        <div
          className={cn(inputVariants({ variant: currentVariant, inputSize, isError }), className)}>
          {multiline ? (
            <textarea
              ref={setRefs}
              rows={rows ?? 3}
              className={cn(
                'flex-1 resize-none outline-none placeholder:text-gray-400 disabled:placeholder:text-gray-400',
                inputClassName,
              )}
              onFocus={e => {
                if (!disableFocusStyle) setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={e => {
                if (!disableFocusStyle) setIsFocused(false);
                setIsFilled(!!(e.currentTarget as HTMLTextAreaElement).value);
                onBlur?.(e);
              }}
              onChange={e => {
                const target = e.currentTarget as HTMLTextAreaElement;
                setIsFilled(!!target.value);
                if (autoResize) {
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }
                onChange?.(e);
              }}
              aria-invalid={!!isError}
              aria-describedby={isError && errorId ? errorId : undefined}
              {...textareaSafeProps}
            />
          ) : (
            <input
              ref={setRefs}
              className={cn(
                'flex-1 outline-none placeholder:text-gray-400 disabled:placeholder:text-gray-400',
                inputClassName,
              )}
              type={isPasswordField ? (showPassword ? 'text' : 'password') : (type ?? 'text')}
              onFocus={e => {
                if (!disableFocusStyle) setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={e => {
                if (!disableFocusStyle) setIsFocused(false);
                setIsFilled(!!e.currentTarget.value);
                props.onBlur?.(e);
              }}
              onChange={e => {
                setIsFilled(!!e.currentTarget.value);
                props.onChange?.(e);
              }}
              aria-invalid={!!isError}
              aria-describedby={isError && errorId ? errorId : undefined}
              {...domRestProps}
            />
          )}
          {isPasswordField && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="shrink-0 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <Icon name="visibility_on" /> : <Icon name="visibility_off" />}
            </button>
          )}
          {rightSlot && (
            <div className="flex shrink-0 items-center justify-center">{rightSlot}</div>
          )}
        </div>
        {isError && (
          <p
            id={errorId}
            className="typo-sm pt-1 pl-4 text-red-500"
            role="alert"
            aria-live="polite">
            {errorMessage ? errorMessage : null}
          </p>
        )}
      </>
    );
  },
);

Input.displayName = 'Input';
