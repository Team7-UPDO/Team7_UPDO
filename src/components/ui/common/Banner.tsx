import Image from 'next/image';

interface BannerProps {
  title: string;
  description: string;
  imageSrc: string;
}

export const Banner = ({ title, description, imageSrc }: BannerProps) => {
  return (
    <section className="flex h-[192px] w-full items-center rounded-3xl bg-white px-4 sm:h-[244px] sm:px-6">
      <div className="flex w-[343px] gap-3 text-nowrap sm:w-[437px] sm:gap-7">
        <div className="relative h-[57px] w-[70px] shrink-0 sm:h-[83px] sm:w-[102px]">
          <Image src={imageSrc} alt="배너 이미지" width={201} height={103} priority />
        </div>
        <div className="flex flex-col justify-center gap-2 text-left sm:gap-4">
          <h2 className="card-title sm:h3Semibold text-gray-900">{title}</h2>
          <p className="typo-body sm:typo-subtitle text-gray-400">{description}</p>
        </div>
      </div>
    </section>
  );
};
