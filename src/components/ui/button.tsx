import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "default" | "destructive" | "orange" | "brand";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[#0A5C36] hover:bg-[#074728] active:bg-[#05361e] text-white font-semibold shadow-sm focus-visible:ring-[#0A5C36]",
      default: "bg-[#0A5C36] hover:bg-[#074728] active:bg-[#05361e] text-white font-semibold shadow-sm focus-visible:ring-[#0A5C36]",
      brand: "bg-[#0A5C36] hover:bg-[#074728] active:bg-[#05361e] text-white font-semibold shadow-sm focus-visible:ring-[#0A5C36]",
      orange: "bg-[#EA580C] hover:bg-[#C2410C] active:bg-[#9A3412] text-white font-semibold shadow-sm focus-visible:ring-[#EA580C]",
      secondary: "bg-[#074728] hover:bg-[#05361e] active:bg-[#042414] text-white font-medium focus-visible:ring-emerald-400",
      outline: "border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/60 text-[#0A5C36] dark:text-emerald-200 focus-visible:ring-[#0A5C36]",
      ghost: "bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/60 text-[#0A5C36] dark:text-emerald-200",
      danger: "bg-[#EA580C] hover:bg-[#C2410C] active:bg-[#9A3412] text-white font-semibold focus-visible:ring-[#EA580C]",
      destructive: "bg-[#EA580C] hover:bg-[#C2410C] active:bg-[#9A3412] text-white font-semibold focus-visible:ring-[#EA580C]",
      success: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold focus-visible:ring-emerald-500"
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 p-2 rounded-xl flex items-center justify-center"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center select-none font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
