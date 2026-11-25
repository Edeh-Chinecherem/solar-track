"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, QrCode, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TECH_NAV = [
  { href: "/tech", label: "My Jobs", icon: Wrench },
  { href: "/tech/scan", label: "Scan QR", icon: QrCode },
  { href: "/tech/alerts", label: "Alerts", icon: Bell },
  { href: "/tech/profile", label: "Profile", icon: User }
];

export function TechBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-[#06361f] border-t border-emerald-200 dark:border-emerald-900 px-2 py-2 flex items-center justify-around shadow-lg pb-safe">
      {TECH_NAV.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 min-w-[64px]",
              isActive
                ? "text-[#0A5C36] dark:text-[#10B981] font-bold"
                : "text-emerald-700/70 dark:text-emerald-200/70 hover:text-[#0A5C36] dark:hover:text-white"
            )}
          >
            <div className={cn("p-1 rounded-lg transition-transform", isActive && "scale-110")}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
