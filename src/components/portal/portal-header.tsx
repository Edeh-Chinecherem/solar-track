"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { GreenerAfrikLogo, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-30 flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Signature GreenerAfrik Dual Stripe */}
      <GreenerAfrikTopBand />

      <div className="px-4 py-3 flex items-center justify-between">
        <Link href="/portal" className="flex items-center gap-2.5">
          <GreenerAfrikLogo size="sm" showTagline={true} />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/support"
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0A5C36] dark:hover:text-[#10B981] transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help & Care</span>
          </Link>
          <Link
            href="/admin"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Staff Desk →
          </Link>
        </div>
      </div>
    </header>
  );
}
