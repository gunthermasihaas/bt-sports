import Image from "next/image";

type Props = {
  name: string;
  href: string;
  imgMobile?: string;
  imgDesktop: string;
};

export function PartnerCard({ name, href, imgMobile, imgDesktop }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visitar ${name}`}
      className="
        group relative flex h-28 items-center justify-center
        rounded-xl
        border border-transparent
        bg-surface-soft
        transition-all duration-300
        hover:-translate-y-1
        hover:border-brand
        hover:bg-surface
        hover:shadow-lg
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand
        focus-visible:ring-offset-2
        focus-visible:ring-offset-brand-deep
      "
    >
      <div className="relative h-full w-full p-6 lg:p-8">
        {imgMobile && (
          <Image
            src={imgMobile}
            alt={name}
            fill
            sizes="100vw"
            className="
              block object-contain
              transition-transform duration-300
              group-hover:scale-[0.92]
              lg:hidden
            "
          />
        )}

        <Image
          src={imgDesktop}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`
            object-contain
            transition-transform duration-300
            lg:group-hover:scale-[0.9]
            ${imgMobile ? "hidden lg:block" : "block"}
          `}
        />
      </div>
    </a>
  );
}
