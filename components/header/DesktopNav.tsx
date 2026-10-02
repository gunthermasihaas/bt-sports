"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
};

type Props = {
  links: Item[];
};

function isHrefActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav({ links }: Props) {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-1 lg:flex">
      {links.map((link, i) => {
        const active =
          Boolean(link.href) && isHrefActive(pathname, link.href as string);

        const className = [
          "group relative rounded-full px-3.5 py-2 text-sm font-semibold",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-brand",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-transparent",
          link.className ?? "",
          active
            ? (link.activeClassName ??
              "bg-[var(--header-nav-active-bg)] text-[var(--header-nav-active-color)] shadow-sm")
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        if (link.href) {
          return (
            <Link
              key={link.href}
              href={link.href}
              className={className}
              aria-current={active ? "page" : undefined}
            >
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
