import Link from "next/link";

type Item = {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

type Props = {
  links: Item[];
};

export function DesktopNav({ links }: Props) {
  return (
    <div className="hidden items-center gap-x-1 lg:flex">
      {links.map((link, i) => {
        const hasCustomClass = Boolean(link.className);

        const className = [
          "rounded-full px-3.5 py-2 text-sm font-semibold",
          "text-[var(--header-nav-color)]",
          "transition-[background-color,color,transform,box-shadow]",
          "duration-200",
          !hasCustomClass &&
            "hover:bg-[var(--header-nav-hover-bg)] hover:text-[var(--header-nav-hover-color)]",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--color-brand)]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-transparent",
          link.className ?? "",
        ]
          .filter(Boolean)
          .join(" ");

        if (link.href) {
          return (
            <Link key={link.href} href={link.href} className={className}>
              {link.label}
            </Link>
          );
        }

        return (
          <button
            key={`${link.label}-${i}`}
            type="button"
            onClick={link.onClick}
            className={className}
          >
            {link.label}
          </button>
        );
      })}
    </div>
  );
}
