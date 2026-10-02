export default function PublicLoading() {
  return (
    <main
      className="min-h-screen bg-background"
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      <div className="site-container py-12 sm:py-16 lg:py-20">
        <div className="animate-pulse">
          <div className="h-3 w-24 rounded-full bg-surface-muted" />

          <div className="mt-5 h-12 w-full max-w-xl rounded-xl bg-surface-muted sm:h-14" />

          <div className="mt-4 h-5 w-full max-w-2xl rounded-lg bg-surface-muted" />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-default bg-surface shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[4/3] bg-surface-muted" />

                <div className="space-y-4 p-5">
                  <div className="h-4 w-full rounded-lg bg-surface-muted" />
                  <div className="h-4 w-4/5 rounded-lg bg-surface-muted" />

                  <div className="flex items-end justify-between gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="h-2.5 w-16 rounded-full bg-surface-muted" />
                      <div className="h-5 w-24 rounded-lg bg-surface-muted" />
                    </div>

                    <div className="h-4 w-20 rounded-lg bg-surface-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
