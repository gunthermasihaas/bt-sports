export default async function AdminDashboard() {
  return (
    <div className="bg-surface p-8">
      <h1 className="text-2xl font-bold text-color-text">Dashboard Admin</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-default bg-surface p-6">
          <p className="text-sm text-muted">Status</p>
          <p className="mt-2 font-medium text-color-text">
            Sistema operacional
          </p>
        </div>

        <div className="rounded-lg border border-default bg-surface p-6">
          <p className="text-sm text-muted">Ambiente</p>
          <p className="mt-2 font-medium text-color-text">Produção</p>
        </div>
      </div>
    </div>
  );
}
