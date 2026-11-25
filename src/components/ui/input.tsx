import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3.5 py-2 text-sm text-[#05361e] dark:text-white placeholder:text-emerald-600/60 dark:placeholder:text-emerald-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C36] focus-visible:border-[#0A5C36] dark:focus-visible:ring-[#10B981] dark:focus-visible:border-[#10B981] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-3.5 py-2 text-sm text-[#05361e] dark:text-white placeholder:text-emerald-600/60 dark:placeholder:text-emerald-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C36] focus-visible:border-[#0A5C36] dark:focus-visible:ring-[#10B981] dark:focus-visible:border-[#10B981] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
