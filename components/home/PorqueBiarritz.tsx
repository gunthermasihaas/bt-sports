const beneficios = [
  {
    numero: "01",
    titulo: "Curadoria esportiva",
    descricao:
      "Selecionamos eventos e experiências que realmente valem a viagem.",
  },
  {
    numero: "02",
    titulo: "Experiência completa",
    descricao:
      "Mais do que ingresso: ajudamos a organizar a jornada ao redor do evento.",
  },
  {
    numero: "03",
    titulo: "Atendimento especializado",
    descricao:
      "Você conta com uma equipe que entende de turismo e de grandes eventos esportivos.",
  },
];

export default function PorqueBiarritz() {
  return (
    <section className="bg-brand-deep py-20 sm:py-24 lg:py-28">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <span className="section-kicker text-brand">Por que Biarritz</span>

            <h2 className="section-title mt-5 max-w-xl text-white">
              A viagem faz parte do evento.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
              Nosso trabalho é transformar grandes competições em experiências
              completas, organizadas e memoráveis.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {beneficios.map((beneficio) => (
              <div
                key={beneficio.numero}
                className="grid gap-4 py-7 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-6"
              >
                <span className="text-sm font-bold tracking-[0.16em] text-brand">
                  {beneficio.numero}
                </span>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {beneficio.titulo}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                    {beneficio.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
