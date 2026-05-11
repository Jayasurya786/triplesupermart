import type { ReactNode } from "react";

export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-display text-brand-800">{title}</h2>
        {subtitle ? <p className="text-sm text-brand-700 mt-2">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
