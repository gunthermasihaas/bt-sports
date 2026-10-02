const principles = [
  {
    number: "01",
    title: "Experiências memoráveis",
    description:
      "Criamos viagens em torno de acontecimentos esportivos que merecem ser vividos de perto.",
  },
  {
    number: "02",
    title: "Acompanhamento integral",
    description:
      "Nossos grupos contam com acompanhamento de guia bilíngue e suporte local especializado.",
  },
  {
    number: "03",
    title: "Segurança e confiança",
    description:
      "Trabalhamos com organizações oficiais de eventos esportivos para proporcionar tranquilidade em cada etapa.",
  },
];

export default function Filosofia() {
  return (
    <section
      id="filosofia"
      className="bg-brand-soft py-20 sm:py-24 lg:py-32"
      aria-labelledby="filosofia-heading"
    >
      <div className="site-container">
        <div className="mb-14 max-w-3xl">
          <span className="section-kicker">Nossa filosofia</span>

          <h2
            id="filosofia-heading"
            className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-default sm:text-5xl"
          >
            O evento é só uma parte da experiência.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Fiel aos princípios da Biarritz Turismo, a BT Sports possui uma
            proposta única no segmento: unir esporte, viagem e atendimento
            especializado.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="rounded-2xl border border-[rgb(65_157_98_/_0.16)] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] sm:p-8"
            >
              <span className="text-sm font-bold tracking-[0.16em] text-brand-dark">
                {principle.number}
              </span>

              <h3 className="mt-12 text-2xl font-extrabold tracking-tight text-default">
                {principle.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
