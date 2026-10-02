import { links, stats } from "@/data/sobreBiarritz";

export default function SobreNos() {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-deep py-20 text-white sm:py-24 lg:py-32"
      aria-labelledby="sobre-biarritz"
    >
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
      <div className="absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-brand-dark/20 blur-3xl" />

      <div className="site-container relative z-10">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <div>
            <span className="section-kicker text-brand">
              Biarritz Turismo Sports
            </span>

            <h1
              id="sobre-biarritz"
              className="mt-6 max-w-4xl text-5xl font-extrabold tracking-[-0.055em] leading-[0.94] text-white sm:text-6xl lg:text-8xl"
            >
              Turismo esportivo para quem quer{" "}
              <span className="text-brand">viver o evento.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              A Biarritz Sports é especializada na criação, planejamento e
              execução de eventos esportivos, com forte atuação em maratonas e
              grandes experiências esportivas ao redor do mundo.
            </p>

            <nav
              aria-label="Sobre a Biarritz"
              className="mt-10 flex flex-wrap gap-3"
            >
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:border-brand/50 hover:bg-white/10 hover:text-white"
                >
                  {link.name}
                  <span className="ml-2 text-brand">→</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="lg:pb-2">
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              {stats.map((stat, index) => (
                <div
                  key={stat.name}
                  className={`p-6 sm:p-8 ${
                    index > 1 ? "border-t border-white/10" : ""
                  } ${index % 2 === 1 ? "border-l border-white/10" : ""}`}
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                    {stat.name}
                  </dt>

                  <dd className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
