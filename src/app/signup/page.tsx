import AuthLayout from '@/components/layout/auth/AuthLayout';
import SignupForm from '@/components/feature/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-6.5rem)] w-full flex-col items-center justify-center">
      <AuthLayout
        title="회원가입"
        bottomText="이미 계정이 있으신가요?"
        bottomLinkText="로그인"
        bottomLinkHref="/login">
        <SignupForm />
      </AuthLayout>
    </main>
  );
}
