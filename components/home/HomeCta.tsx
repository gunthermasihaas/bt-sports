import Link from "next/link";

export default function HomeCta() {
  return (
    <section className="bg-surface py-20 sm:py-24 lg:py-28">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand p-8 shadow-[var(--shadow-elevated)] sm:p-12 lg:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
              Próximo destino
            </span>

            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Seu próximo grande evento começa aqui.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Encontre uma experiência, escolha seu próximo destino e deixe a
              viagem começar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pacotes"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-deep px-6 text-sm font-bold text-white transition hover:bg-black"
              >
                Explorar pacotes
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/contato"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Falar com a Biarritz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
