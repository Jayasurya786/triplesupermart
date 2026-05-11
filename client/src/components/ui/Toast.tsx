import React, { createContext, useContext, useMemo, useState } from "react";

type Toast = { id: string; title?: string; message: string; ttl?: number };

type ToastContextValue = {
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  hide: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (t: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast: Toast = { id, ...t };
    setToasts((s) => [...s, toast]);
    if (toast.ttl ?? 5000) {
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), toast.ttl ?? 5000);
    }
  };

  const hide = (id: string) => setToasts((s) => s.filter((t) => t.id !== id));

  const value = useMemo(() => ({ toasts, show, hide }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-3 bottom-20 z-50 flex flex-col gap-3 items-stretch sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm sm:items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="w-full rounded-xl bg-white/95 border border-emerald-100 shadow-lg p-3 flex flex-col gap-1"
            style={{ borderLeft: "4px solid #16a34a" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {t.title && <div className="font-semibold text-sm text-emerald-800">{t.title}</div>}
                <div className="text-sm text-slate-700">{t.message}</div>
              </div>
              <button onClick={() => hide(t.id)} className="text-xs text-slate-500 ml-2 shrink-0">Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export default ToastProvider;
