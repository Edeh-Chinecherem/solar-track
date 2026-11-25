"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { GreenerAfrikLogo, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-30 flex flex-col bg-white/95 dark:bg-[#06361f]/95 backdrop-blur border-b border-emerald-200 dark:border-emerald-900 shadow-sm">
      {/* Signature GreenerAfrik Dual Stripe */}
      <GreenerAfrikTopBand />

      <div className="px-4 py-3 flex items-center justify-between">
        <Link href="/portal" className="flex items-center gap-2.5">
          <GreenerAfrikLogo size="sm" showTagline={true} />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/support"
            className="flex items-center gap-1 text-xs font-semibold text-[#0A5C36] dark:text-emerald-200 hover:text-[#EA580C] dark:hover:text-orange-400 transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help & Care</span>
          </Link>
          <Link
            href="/admin"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#084729] text-[#0A5C36] dark:text-emerald-100 hover:bg-emerald-100 dark:hover:bg-[#0A5C36] transition"
          >
            Staff Desk →
          </Link>
        </div>
      </div>
    </header>
  );
}
