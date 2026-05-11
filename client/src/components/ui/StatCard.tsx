export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.2)] backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.28em] text-black">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
