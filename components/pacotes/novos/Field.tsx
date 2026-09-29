import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  description?: string;
  children: ReactNode;
};

export default function Field({
  label,
  required,
  hint,
  description,
  children,
}: FieldProps) {
  const supportingText = description ?? hint;

  return (
    <div>
      <label className="block text-sm font-semibold text-admin">
        {label} {required && <span className="text-brand">*</span>}
      </label>

      {supportingText && (
        <p className="mt-1 text-xs leading-5 text-admin-muted">
          {supportingText}
        </p>
      )}

      {children}
    </div>
  );
}
