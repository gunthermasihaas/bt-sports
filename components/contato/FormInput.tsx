import { InputHTMLAttributes } from "react";

import { FormField } from "./FormField";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormInput({ label, error, ...props }: Props) {
  return (
    <FormField label={label} required={props.required} error={error}>
      <input
        {...props}
        aria-invalid={Boolean(error)}
        className={`min-h-12 w-full rounded-xl border bg-surface px-4 text-sm text-default shadow-sm outline-none transition placeholder:text-muted/60 focus-ring-brand ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-default hover:border-border-muted focus:border-brand"
        }`}
      />
    </FormField>
  );
}
