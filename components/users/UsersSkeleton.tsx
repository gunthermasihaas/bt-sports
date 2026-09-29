function SkeletonRow() {
  return (
    <div className="animate-pulse px-4 py-5 sm:px-5 md:grid md:grid-cols-[1.4fr_1.8fr_0.7fr_180px] md:items-center md:gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-surface-muted" />

        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-surface-muted" />
          <div className="h-3 w-44 rounded bg-surface-muted md:hidden" />
        </div>
      </div>

      <div className="mt-4 hidden h-3 w-56 rounded bg-surface-muted md:mt-0 md:block" />

      <div className="mt-4 h-6 w-16 rounded-full bg-surface-muted md:mt-0" />

      <div className="mt-4 flex gap-2 md:mt-0 md:justify-end">
        <div className="h-9 w-16 rounded-lg bg-surface-muted" />
        <div className="h-9 w-20 rounded-lg bg-surface-muted" />
      </div>
    </div>
  );
}

export default function UsersSkeleton() {
  return (
    <section className="overflow-hidden rounded-xl border border-default bg-surface shadow-sm">
      <div className="hidden border-b border-default bg-surface-muted px-5 py-3 md:grid md:grid-cols-[1.4fr_1.8fr_0.7fr_180px] md:gap-4">
        <div className="h-3 w-16 rounded bg-surface-muted" />
        <div className="h-3 w-20 rounded bg-surface-muted" />
        <div className="h-3 w-14 rounded bg-surface-muted" />
        <div />
      </div>

      <div className="divide-y divide-default">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </section>
  );
}
