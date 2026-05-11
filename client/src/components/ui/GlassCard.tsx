import type { ReactNode } from "react";

export function GlassCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.24)] backdrop-blur-xl">
      {children}
    </div>
  );
}
