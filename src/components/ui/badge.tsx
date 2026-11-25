import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "amber" | "green" | "orange";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#0A5C36] text-white dark:bg-emerald-500 dark:text-[#042414]",
    secondary: "bg-emerald-50 text-[#0A5C36] border border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-800",
    success: "bg-emerald-100 text-[#0A5C36] dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    warning: "bg-orange-100 text-[#EA580C] dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
    destructive: "bg-[#EA580C] text-white dark:bg-[#EA580C] dark:text-white border border-[#C2410C]",
    outline: "text-[#0A5C36] dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-transparent",
    amber: "bg-[#EA580C]/15 text-[#EA580C] dark:text-orange-300 border border-[#EA580C]/30",
    green: "bg-[#0A5C36]/15 text-[#0A5C36] dark:text-emerald-300 border border-[#0A5C36]/30",
    orange: "bg-[#EA580C]/15 text-[#EA580C] dark:text-orange-300 border border-[#EA580C]/30"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
