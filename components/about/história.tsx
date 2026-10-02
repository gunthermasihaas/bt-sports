export default function NossaHistoria() {
  return (
    <section
      id="historia"
      className="bg-surface py-20 sm:py-24 lg:py-32"
      aria-labelledby="nossa-historia"
    >
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:gap-20">
          <div>
            <span className="section-kicker">Desde 1993</span>

            <h2
              id="nossa-historia"
              className="mt-5 max-w-sm text-4xl font-extrabold tracking-[-0.045em] text-default sm:text-5xl"
            >
              Uma história construída em torno de viagens.
            </h2>
          </div>

          <div className="max-w-3xl">
            <div className="border-l-2 border-brand pl-6 sm:pl-8">
              <p className="text-lg leading-8 text-muted sm:text-xl sm:leading-9">
                Fundada em 1993 e dirigida até hoje pela francesa{" "}
                <strong className="font-bold text-brand-dark">
                  Véronique Buisson Masi
                </strong>
                , conselheira do{" "}
                <strong className="font-bold text-brand-dark">
                  Órgão Governamental do Turismo Francês
                </strong>{" "}
                para o Brasil, a empresa tem sede em Porto Alegre, RS, e atende
                todo o mercado brasileiro.
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="rounded-2xl border border-default bg-surface-muted p-6">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">
                  Registro
                </span>

                <p className="mt-3 text-base leading-7 text-default">
                  A{" "}
                  <strong className="font-bold">Buisson &amp; Cia Ltda</strong>{" "}
                  é registrada no{" "}
                  <strong className="font-bold text-brand-dark">
                    CADASTUR
                  </strong>
                  .
                </p>
              </div>

              <div className="rounded-2xl border border-default bg-surface-muted p-6">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">
                  Reconhecimento
                </span>

                <p className="mt-3 text-base leading-7 text-default">
                  Parceira oficial da{" "}
                  <strong className="font-bold text-brand-dark">
                    Atout France
                  </strong>{" "}
                  e distinguida em 2011 pelo{" "}
                  <strong className="font-bold text-brand-dark">
                    Office de Tourisme de Paris
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm font-semibold text-muted">
              <span className="h-px w-12 bg-brand" />
              <span>Porto Alegre · Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
