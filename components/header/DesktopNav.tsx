import Link from "next/link";

type Item = {
  label: string;
  href?: string;
  onClick?: () => void;
  className: string;
};

type Props = {
  links: Item[];
};

export function DesktopNav({ links }: Props) {
  return (
    <div className="hidden lg:flex gap-x-8">
      {links.map((link, i) =>
        link.href ? (
          <Link key={link.href} href={link.href} className={link.className}>
            {link.label}
          </Link>
        ) : (
          <button key={i} onClick={link.onClick} className={link.className}>
            {link.label}
          </button>
        )
      )}
    </div>
  );
}
