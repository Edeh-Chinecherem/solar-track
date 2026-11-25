"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      const newToast: Toast = {
        id,
        title,
        description: options?.description,
        type: options?.type || "info"
      };

      setToasts((prev) => [...prev, newToast]);

      const duration = options?.duration ?? 4500;
      setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex max-w-md w-full flex-col gap-2 pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
          };

          const borderColors = {
            success: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100",
            warning: "border-amber-200 dark:border-amber-900 bg-amber-50/95 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100",
            error: "border-rose-200 dark:border-rose-900 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100",
            info: "border-sky-200 dark:border-sky-900 bg-sky-50/95 dark:bg-sky-950/90 text-sky-900 dark:text-sky-100"
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3",
                borderColors[t.type]
              )}
            >
              {icons[t.type]}
              <div className="flex-1 text-sm">
                <div className="font-semibold">{t.title}</div>
                {t.description && <div className="text-xs opacity-90 mt-0.5">{t.description}</div>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
