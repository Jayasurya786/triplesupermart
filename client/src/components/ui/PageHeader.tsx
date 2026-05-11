import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-4xl md:text-5xl font-display text-brand-800">{title}</h1>
        <p className="mt-3 text-base text-brand-700 max-w-2xl">{description}</p>
      </div>
      {actions}
    </div>
  );
}
