import AuthLayout from '@/components/layout/auth/AuthLayout';
import LoginForm from '@/components/feature/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-6.5rem)] w-full flex-col items-center justify-center">
      <AuthLayout
        title="로그인"
        bottomText="UPDO가 처음이신가요?"
        bottomLinkText="회원가입"
        bottomLinkHref="/signup">
        <LoginForm />
      </AuthLayout>
    </main>
  );
}
