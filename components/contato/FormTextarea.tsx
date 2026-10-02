import { TextareaHTMLAttributes } from "react";

import { FormField } from "./FormField";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function FormTextarea({ label, ...props }: Props) {
  return (
    <FormField label={label} required={props.required}>
      <textarea
        {...props}
        className="min-h-36 w-full resize-y rounded-xl border border-default bg-surface px-4 py-3 text-sm leading-6 text-default shadow-sm outline-none transition placeholder:text-muted/60 hover:border-border-muted focus:border-brand focus-ring-brand"
      />
    </FormField>
  );
}
