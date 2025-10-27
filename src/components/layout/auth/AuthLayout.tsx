import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  title,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  children,
}: {
  title: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkHref: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:gap-32">
      <div className="flex w-full max-w-[500px] min-w-[300px] items-center justify-center sm:w-[500px] sm:max-w-[500px] md:max-w-[530px]">
        <Image
          src="/images/auth_logo.png"
          alt="Auth logo"
          width={529}
          height={345}
          priority
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      <section className="flex w-full max-w-[630px] min-w-[343px] flex-col items-center justify-center rounded-xl bg-white px-4 py-[44px] shadow-md sm:w-[630px] sm:px-14 md:w-[568px]">
        <h1 className="mb-6 w-full text-center text-3xl font-semibold text-gray-800">{title}</h1>
        <div className="flex w-full flex-col">{children}</div>
        <p className="flex w-full justify-center gap-2 text-center text-sm text-gray-600">
          {bottomText}
          <Link
            href={bottomLinkHref}
            className="font-bold text-purple-600 underline hover:text-purple-700 focus:text-purple-800">
            {bottomLinkText}
          </Link>
        </p>
      </section>
    </main>
  );
}
