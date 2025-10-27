'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { authService } from '@/services/auths/authService';
import { LoginFormSchema } from '@/schemas/authsSchema';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/useAuthStore';

export type LoginFormType = z.infer<typeof LoginFormSchema>;

const firstIssueMessage = (err: z.ZodError) =>
  err.issues[0]?.message ?? '입력값이 올바르지 않습니다.';

export default function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();

  // ✅ Zustand 훅 기반 접근 (리액티브)
  const { setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const [globalError, setGlobalError] = useState<string | null>(null);

  // 입력 중 1초 후 검증 (과도한 트리거 방지)
  const debouncedValidate = useDebouncedCallback((field: keyof LoginFormType) => {
    void trigger(field);
  }, 500);

  // RHF register에 Debounce 검증 결합
  const registerWithValidation = (name: keyof LoginFormType) => {
    const shape = LoginFormSchema.shape[name];
    const base = register(name, {
      required: name === 'email' ? '이메일을 입력해주세요.' : '비밀번호를 입력해주세요.',
      validate: (value: string) => {
        const parsed = shape.safeParse(value);
        return parsed.success ? true : firstIssueMessage(parsed.error);
      },
    });

    return {
      ...base,
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        base.onBlur(e);
        void trigger(name);
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        base.onChange(e);
        debouncedValidate(name);
      },
    };
  };

  // 로그인 제출 핸들러
  const onSubmit = handleSubmit(async data => {
    // ✅ 전체 Zod 검증
    const parsed = LoginFormSchema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof LoginFormType | undefined;
        if (path) {
          setError(path, { type: 'zod', message: issue.message });
        }
      });
      return;
    }

    try {
      const response = await authService.signin(parsed.data);
      setToken(response.token);

      showToast('로그인에 성공하였습니다. 환영합니다!', 'success');
      router.replace('/'); // 성공 시 메인으로 이동
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null) {
        const e = err as { parameter?: keyof LoginFormType; message?: string };

        // ✅ 필드별 서버 오류
        if (e.parameter) {
          setError(e.parameter, {
            type: 'server',
            message: e.message ?? '입력값이 올바르지 않습니다.',
          });
          return;
        }

        // ✅ 전역 서버 오류
        setGlobalError(e.message ?? '서버 오류가 발생했습니다.');
        return;
      }
      setGlobalError('서버 오류가 발생했습니다.');
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-[568px] min-w-[280px] flex-col gap-2 p-2 sm:p-4"
      noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="pl-1 text-sm font-medium text-gray-700">
          이메일
        </label>
        <Input
          id="email"
          inputSize="lg"
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          {...registerWithValidation('email')}
          disabled={isSubmitting}
          autoComplete="email"
        />
        <p className="h-5 pl-1 text-sm text-red-500">{errors.email?.message ?? ''}</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="pl-1 text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <Input
          id="password"
          inputSize="lg"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          {...registerWithValidation('password')}
          disabled={isSubmitting}
          autoComplete="current-password"
        />
        <p className="h-5 pl-1 text-sm text-red-500">{errors.password?.message ?? ''}</p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="mt-2 h-[48px] w-full text-base font-semibold"
        aria-label="로그인">
        {isSubmitting ? <LoadingSpinner size="xs" color="white" /> : '로그인'}
      </Button>

      {globalError && (
        <p role="alert" className="typo-sm mt-3 text-center text-red-500">
          {globalError}
        </p>
      )}
    </form>
  );
}
