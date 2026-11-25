"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "right" | "bottom";
}

export function Sheet({ open, onOpenChange, children, side = "right" }: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#042414]/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed bg-white dark:bg-[#06361f] shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col",
          side === "right"
            ? "inset-y-0 right-0 w-full sm:max-w-xl border-l border-emerald-200 dark:border-emerald-800 animate-in slide-in-from-right"
            : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t border-emerald-200 dark:border-emerald-800 animate-in slide-in-from-bottom"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({
  className,
  children,
  onClose
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className={cn("flex items-center justify-between p-6 border-b border-emerald-100 dark:border-emerald-800", className)}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-emerald-600/80 hover:text-[#05361e] dark:text-emerald-300 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-[#084729] transition"
          aria-label="Close sheet"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-bold text-[#05361e] dark:text-white", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-200/80 mt-1", className)} {...props} />;
}

export function SheetContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto p-6 space-y-6", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 border-t border-emerald-100 dark:border-emerald-800 bg-emerald-50/50 dark:bg-[#06361f]/50 flex items-center justify-end gap-3", className)}
      {...props}
    />
  );
}
