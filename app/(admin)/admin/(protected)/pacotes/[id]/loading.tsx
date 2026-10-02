export default function LoadingEditarPacote() {
  return (
    <div
      className="min-h-screen bg-admin px-4 py-8 sm:px-6 sm:py-10"
      aria-busy="true"
      aria-label="Carregando pacote"
    >
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="h-8 w-48 rounded-xl bg-surface-muted" />

          <div className="hidden h-10 w-28 rounded-xl bg-surface-muted sm:block" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border-muted bg-surface p-6">
              <div className="h-5 w-32 rounded-lg bg-surface-muted" />

              <div className="mt-6 space-y-4">
                <div className="h-12 rounded-xl bg-surface-muted" />
                <div className="h-12 rounded-xl bg-surface-muted" />
                <div className="h-32 rounded-xl bg-surface-muted" />
                <div className="h-32 rounded-xl bg-surface-muted" />
              </div>
            </section>

            <section className="rounded-2xl border border-border-muted bg-surface p-6">
              <div className="h-5 w-40 rounded-lg bg-surface-muted" />

              <div className="mt-6 h-48 rounded-xl bg-surface-muted" />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border-muted bg-surface p-6">
              <div className="h-5 w-28 rounded-lg bg-surface-muted" />

              <div className="mt-6 aspect-[4/3] rounded-xl bg-surface-muted" />

              <div className="mt-5 h-11 rounded-xl bg-surface-muted" />
            </section>

            <section className="rounded-2xl border border-border-muted bg-surface p-6">
              <div className="h-5 w-24 rounded-lg bg-surface-muted" />

              <div className="mt-5 space-y-3">
                <div className="h-10 rounded-xl bg-surface-muted" />
                <div className="h-10 rounded-xl bg-surface-muted" />
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <div className="h-11 w-full rounded-xl bg-surface-muted sm:w-32" />
          <div className="h-11 w-full rounded-xl bg-brand-soft sm:w-40" />
        </div>
      </div>
    </div>
  );
}
