import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";
  const variants: Record<Variant, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-500",
    ghost: "bg-transparent text-brand-700 hover:bg-brand-50",
    outline: "border border-brand-200 text-brand-700 hover:border-brand-400",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
