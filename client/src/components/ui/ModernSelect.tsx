import React from "react";
import { ChevronDown } from "lucide-react";

type ModernSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const ModernSelect = React.forwardRef<HTMLSelectElement, ModernSelectProps>(function ModernSelect(
  { className = "", children, ...props },
  ref
) {
  return (
    <div className="group relative w-full transition-transform duration-300 hover:-translate-y-0.5">
      <select
        ref={ref}
        {...props}
        className={`peer w-full appearance-none rounded-[1.25rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 pr-10 text-sm text-black shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] outline-none transition duration-300 hover:border-emerald-300 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)] focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 ${className}`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-300 group-hover:text-emerald-500 peer-focus:rotate-180 peer-focus:text-emerald-600" />
    </div>
  );
});

ModernSelect.displayName = "ModernSelect";