"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GreenerAfrikLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "full" | "horizontal" | "icon";
  textColor?: "dark" | "light" | "auto";
  showTagline?: boolean;
  showRc?: boolean;
  className?: string;
}

export function GreenerAfrikEmblem({ size = 36, className }: { size?: number; className?: string }) {
  // Circular sunburst/leaf rosette with alternating forest green (#0A5C36) & sunburst orange (#EA580C)
  const petals = [
    { angle: 0, color: "#0A5C36" },
    { angle: 45, color: "#EA580C" },
    { angle: 90, color: "#0A5C36" },
    { angle: 135, color: "#EA580C" },
    { angle: 180, color: "#0A5C36" },
    { angle: 225, color: "#EA580C" },
    { angle: 270, color: "#0A5C36" },
    { angle: 315, color: "#EA580C" }
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="GreenerAfrik Emblem"
    >
      <defs>
        <radialGradient id="ga-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#DCFCE7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 8 radial leaf/sunburst petals radiating from center */}
      {petals.map((petal, i) => (
        <g key={i} transform={`rotate(${petal.angle} 50 50)`}>
          {/* Teardrop / leaf petal */}
          <path
            d="M50 14 C44 26, 45 40, 50 48 C55 40, 56 26, 50 14 Z"
            fill={petal.color}
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Subtle inner ring */}
      <circle cx="50" cy="50" r="14" fill="#0A5C36" stroke="#ffffff" strokeWidth="2.5" />
      {/* Central sun burst core */}
      <circle cx="50" cy="50" r="7" fill="#EA580C" />
    </svg>
  );
}

export function GreenerAfrikLogo({
  size = "md",
  variant = "horizontal",
  textColor = "auto",
  showTagline = true,
  showRc = false,
  className
}: GreenerAfrikLogoProps) {
  const sizeMap = {
    xs: { iconSize: 22, text: "text-xs", sub: "text-[8px]" },
    sm: { iconSize: 28, text: "text-sm", sub: "text-[9px]" },
    md: { iconSize: 36, text: "text-base", sub: "text-[10px]" },
    lg: { iconSize: 44, text: "text-xl", sub: "text-xs" },
    xl: { iconSize: 56, text: "text-2xl", sub: "text-sm" }
  };

  const { iconSize, text, sub } = sizeMap[size];

  if (variant === "icon") {
    return <GreenerAfrikEmblem size={iconSize} className={className} />;
  }

  const isLight = textColor === "light";
  const isDark = textColor === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        variant === "full" ? "flex-col items-center text-center" : "flex-row",
        className
      )}
    >
      <GreenerAfrikEmblem size={iconSize} />

      <div className={cn("flex flex-col leading-none", variant === "full" && "items-center")}>
        <div className="flex items-baseline tracking-tight">
          <span className="font-extrabold text-[#0A5C36] dark:text-[#10B981]">Greener</span>
          <span
            className={cn(
              "font-extrabold",
              isLight
                ? "text-white"
                : isDark
                ? "text-[#05361e]"
                : "text-[#05361e] dark:text-white"
            )}
          >
            Afrik
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={cn(
                "italic font-medium tracking-normal",
                sub,
                isLight
                  ? "text-emerald-100"
                  : isDark
                  ? "text-emerald-700"
                  : "text-emerald-700 dark:text-emerald-200"
              )}
            >
              ...Powering Africa
            </span>
            {showRc && (
              <span className={cn("text-[9px] font-semibold text-[#EA580C] uppercase tracking-wider")}>
                RC 9402141
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function GreenerAfrikTopBand({ className }: { className?: string }) {
  // Official document top stripe: Sunburst Orange (#EA580C) + Forest Green (#0A5C36)
  return (
    <div className={cn("w-full flex h-1.5 shrink-0 overflow-hidden", className)}>
      <div className="w-1/3 bg-[#EA580C]" />
      <div className="w-2/3 bg-[#0A5C36]" />
    </div>
  );
}
