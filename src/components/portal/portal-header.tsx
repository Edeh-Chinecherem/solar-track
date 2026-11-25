"use client";

import React from "react";
import Link from "next/link";
import { Sun, ShieldCheck, PhoneCall, HelpCircle, LogOut } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
      <Link href="/portal" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
          <Sun className="w-5 h-5 fill-slate-950" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight block">
            Solar<span className="text-amber-500">Track</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            Customer Self-Service
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/portal/support"
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Help & Care</span>
        </Link>
        <Link
          href="/admin"
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Staff Hub →
        </Link>
      </div>
    </header>
  );
}
