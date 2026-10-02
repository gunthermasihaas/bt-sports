type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, error, children }: Props) {
  return (
    <div>
      <label className="block text-sm font-bold text-default">
        {label}

        {required && (
          <span aria-hidden="true" className="ml-1 text-brand-dark">
            *
          </span>
        )}
      </label>

      <div className="mt-2">{children}</div>

      {error && <p className="mt-2 text-sm font-medium text-danger">{error}</p>}
    </div>
  );
}
