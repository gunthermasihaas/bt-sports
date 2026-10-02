import Link from "next/link";

type Props = {
  href: string;
  label: string;
  index: number;
};

export default function CategoriaButton({ href, label, index }: Props) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={href}
      className="group relative block h-full overflow-hidden rounded-2xl bg-brand-deep shadow-[var(--shadow-card)] transition-all duration-500 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="category-art absolute inset-0 transition-transform duration-700 ease-[var(--ease-emphasized)] group-hover:scale-105" />

      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(4_15_10_/_0.9)] via-[rgb(4_15_10_/_0.15)] to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold tracking-[0.16em] text-white/60">
            {number}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            Experiência
          </span>

          <span className="mt-2 block text-xl font-extrabold leading-tight tracking-tight text-white">
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
}
