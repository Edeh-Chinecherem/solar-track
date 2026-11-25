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
            warning: <AlertTriangle className="w-5 h-5 text-[#EA580C] dark:text-orange-400 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-[#EA580C] dark:text-orange-400 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-[#0A5C36] dark:text-[#10B981] shrink-0 mt-0.5" />
          };

          const borderColors = {
            success: "border-emerald-200 dark:border-emerald-900 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100",
            warning: "border-orange-200 dark:border-orange-900 bg-orange-50/95 dark:bg-orange-950/90 text-orange-900 dark:text-orange-100",
            error: "border-orange-300 dark:border-orange-800 bg-orange-100/95 dark:bg-orange-950/95 text-orange-950 dark:text-orange-100",
            info: "border-[#0A5C36]/25 dark:border-emerald-900 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100"
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
