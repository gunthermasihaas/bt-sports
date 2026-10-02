import Link from "next/link";

type Item = {
  label: string;
  href?: string;
  onClick?: () => void;
  className: string;
};

type Section = {
  title?: string;
  items: Item[];
};

type Props = {
  sections: Section[];
};

export function MobileMenu({ sections }: Props) {
  return (
    <div className="mt-6 space-y-7">
      {sections.map((section, i) => (
        <section key={i}>
          {section.title && (
            <p className="px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              {section.title}
            </p>
          )}

          <div className="mt-2 space-y-1.5">
            {section.items.map((item, j) =>
              item.href ? (
                <Link
                  key={`${item.href}-${j}`}
                  href={item.href}
                  className={item.className}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={`${item.label}-${j}`}
                  type="button"
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
