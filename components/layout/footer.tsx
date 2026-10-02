import Link from "next/link";

import { FooterPartners } from "@/components/footer/FooterPartners";
import { FooterSocial } from "@/components/footer/FooterSocial";

export default function Footer() {
  return (
    <footer className="bg-brand-deep text-white">
      <div className="site-container py-16 sm:py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:gap-24">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                BT
              </span>

              <span>
                <span className="block text-sm font-extrabold tracking-tight">
                  BIARRITZ
                </span>

                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Turismo Sports
                </span>
              </span>
            </Link>

            <h2 className="mt-8 max-w-lg text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              Grandes eventos. Grandes viagens.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
              Turismo esportivo para quem quer viver cada momento do evento,
              dentro e fora do estádio.
            </p>

            <nav
              aria-label="Navegação do rodapé"
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/70"
            >
              <Link href="/categorias" className="transition hover:text-white">
                Experiências
              </Link>

              <Link href="/pacotes" className="transition hover:text-white">
                Pacotes
              </Link>

              <Link href="/sobre" className="transition hover:text-white">
                Sobre nós
              </Link>

              <Link href="/contato" className="transition hover:text-white">
                Contato
              </Link>
            </nav>
          </div>

          <FooterSocial />
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <FooterPartners />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Biarritz Turismo Sports</span>

          <span>Turismo esportivo e experiências internacionais</span>
        </div>
      </div>

      <script async src="https://www.instagram.com/embed.js" />
    </footer>
  );
}
