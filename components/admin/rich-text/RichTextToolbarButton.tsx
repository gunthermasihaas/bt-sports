"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

export default function RichTextToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: Props) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
      className={[
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2",
        "text-admin-muted transition-colors",
        "hover:bg-surface hover:text-admin",
        "focus:outline-none focus:ring-2 focus:ring-brand/30",
        "disabled:pointer-events-none disabled:opacity-40",
        active ? "bg-brand/10 text-brand shadow-sm" : "bg-transparent",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
