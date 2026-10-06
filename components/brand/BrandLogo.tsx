import Image from "next/image";

type Props = {
  size?: "sm" | "md";
  showName?: boolean;
  className?: string;
};

const sizes = {
  sm: {
    box: "h-9 w-9",
    image: 36,
    name: "text-xs",
    subtitle: "text-[9px]",
  },
  md: {
    box: "h-10 w-10",
    image: 40,
    name: "text-sm",
    subtitle: "text-[10px]",
  },
} as const;

export function BrandLogo({
  size = "md",
  showName = true,
  className = "",
}: Props) {
  const config = sizes[size];

  return (
    <div
      className={[
        "flex items-center gap-3",
        "text-(--header-nav-color)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand shadow-sm ${config.box}`}
      >
        <Image
          src="/images/brand/logo.svg"
          alt=""
          width={config.image}
          height={config.image}
          priority
          className="h-full w-full object-contain p-1.5"
        />
      </span>

      {showName && (
        <span className="hidden leading-none sm:block">
          <span
            className={`block font-extrabold tracking-tight ${config.name} text-current`}
          >
            BIARRITZ
          </span>

          <span
            className={`mt-1 block font-semibold uppercase tracking-[0.18em] ${config.subtitle} text-current opacity-80`}
          >
            Turismo Sports
          </span>
        </span>
      )}
    </div>
  );
}
