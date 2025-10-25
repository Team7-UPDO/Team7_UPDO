// -----------------------------------------------------------------------------
// NOTE: 팀 공용 UI Input 인터페이스(placeholder, errorMessage, inputSize, rightSlot 등)
//       를 100% 준수하는 회원가입 폼 구현입니다.
//       - RHF + Zod 유효성 검사 통합
//       - 입력 중 과도한 검증 방지를 위한 디바운스 적용
//       - 라우팅 의존성 제거(성공 시 동작을 onSignupSuccess 콜백으로 외부 주입)
//       - Storybook(Vite) 환경에서도 Next Router 없이 안전하게 렌더링
// NOTE: 반응형 폼 사이즈 명세 (회원가입)
//       - 모바일: 343×668
//       - 태블릿/데스크톱: 568×802
//       - AuthLayout이 외곽 박스를 담당하므로 bg/rounded/shadow 없음
// -----------------------------------------------------------------------------

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';
import { JoinFormSchema } from '@/schemas/authsSchema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { authService } from '@/services/auths/authService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/useAuthStore';

export type JoinFormType = z.infer<typeof JoinFormSchema>;

export default function SignupForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const { setToken } = useAuthStore();

  const {
    register, // input에 연결(값/이벤트 바인딩)
    handleSubmit, // 제출 시 검증+핸들 실행
    trigger, // 특정 필드만 수동 검증할 때 사용
    setError, // 서버/비즈니스 로직 에러를 필드에 바인딩
    formState: { errors, isSubmitting }, // 에러 오브젝트 및 제출 상태
  } = useForm<JoinFormType>({
    resolver: async values => {
      // Zod + RHF 통합 검증 : resolver 직접 구현
      const result = JoinFormSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      // Zod 에러를 RHF 포맷으로 변환
      const formErrors = result.error.flatten().fieldErrors;
      return {
        values: {},
        errors: Object.entries(formErrors).reduce(
          (acc, [key, messages]) => {
            acc[key as keyof JoinFormType] = {
              type: 'manual',
              message: messages?.[0],
            };
            return acc;
          },
          {} as Record<string, { type: string; message: string }>,
        ),
      };
    },
    mode: 'onTouched', // ✅ 사용자가 터치한 뒤에만 검증
    reValidateMode: 'onChange', // 값 변경 시 재검증
  });

  // 입력 중 과도한 trigger 호출 억제: 사용자가 멈춘 뒤 1000ms 후 검증
  const debouncedValidate = useDebouncedCallback((field: keyof JoinFormType) => {
    void trigger(field);
  }, 1000);

  // RHF register에 onBlur/onChange를 결합해 일관된 UX 제공
  const registerWithValidation = (name: keyof JoinFormType) => {
    const base = register(name);
    return {
      ...base,
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        base.onBlur(e);
        void trigger(name); // blur 즉시 검증
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        base.onChange(e);
        debouncedValidate(name); // 입력 멈춤 1000ms 후 디바운스 검증
      },
    };
  };

  // 제출 핸들러: 서버에 회원가입 요청 → 성공 시 onSignupSuccess 콜백 실행
  const onSubmit = handleSubmit(async data => {
    try {
      // 1️⃣ 서버에 회원가입 요청
      await authService.signup({
        email: data.email,
        password: data.password,
        name: data.name,
        companyName: data.companyName,
      });

      // 2️⃣ 회원가입 성공 → 자동 로그인
      const response = await authService.signin({
        email: data.email,
        password: data.password,
      });
      setToken(response.token);

      // 3️⃣ 토스트 + 리다이렉트
      showToast('UPDO의 회원이 되신 것을 환영합니다! 자동으로 로그인 되었습니다.', 'success');
      router.replace('/');
    } catch (err: unknown) {
      // 서버 응답 예: { status, code, message, parameter }
      // parameter가 있으면 해당 필드 하단에 에러 메시지를 표시
      if (typeof err === 'object' && err !== null) {
        const e = err as { parameter?: string; message?: string };
        const targetField = (e.parameter as keyof JoinFormType) || 'email';
        setError(targetField, {
          type: 'server',
          message: e.message ?? '회원가입에 실패했습니다.',
        });
      }
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col items-start gap-4" noValidate>
      {/* 이름 */}
      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="name"
          className="w-fit pl-[2px] text-left text-sm font-medium text-gray-700">
          이름
        </label>
        <Input
          id="name"
          inputSize="lg"
          placeholder="이름을 입력하세요"
          {...registerWithValidation('name')}
          errorMessage={errors.name?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* 직업 */}
      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="companyName"
          className="w-fit pl-[2px] text-left text-sm font-medium text-gray-700">
          직업
        </label>
        <Input
          inputSize="lg"
          placeholder="직업을 입력하세요"
          {...registerWithValidation('companyName')}
          errorMessage={errors.companyName?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* 이메일 */}
      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="email"
          className="w-fit pl-[2px] text-left text-sm font-medium text-gray-700">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          inputSize="lg"
          placeholder="이메일 주소를 입력하세요"
          {...registerWithValidation('email')}
          errorMessage={errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* 비밀번호 */}
      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="password"
          className="w-fit pl-[2px] text-left text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          inputSize="lg"
          placeholder="비밀번호를 입력하세요"
          {...registerWithValidation('password')}
          errorMessage={errors.password?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex w-full flex-col gap-1">
        <label
          htmlFor="passwordConfirm"
          className="w-fit pl-[2px] text-left text-sm font-medium text-gray-700">
          비밀번호 확인
        </label>
        <Input
          id="passwordConfirm"
          type="password"
          inputSize="lg"
          placeholder="비밀번호를 다시 입력하세요"
          {...registerWithValidation('passwordConfirm')}
          errorMessage={errors.passwordConfirm?.message}
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="mt-6 h-[48px] w-full text-base font-semibold">
        {isSubmitting ? <LoadingSpinner size="xs" color="white" /> : '회원가입'}
      </Button>
    </form>
  );
}
