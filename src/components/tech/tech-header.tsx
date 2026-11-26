"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { GreenerAfrikEmblem, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";

export function TechHeader() {
  const { currentUser } = useAuthRole();

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-[#05361e] text-white border-b border-emerald-800 shadow-md">
      {/* Signature GreenerAfrik Dual Stripe */}
      <GreenerAfrikTopBand />

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GreenerAfrikEmblem size={32} />
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>GreenerAfrik Field</span>
              <span className="text-[10px] bg-[#EA580C]/20 text-[#EA580C] px-1.5 py-0.2 rounded border border-[#EA580C]/30 font-bold">
                TECH
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/80">Engr: {currentUser.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/80 text-[10px] font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Synced</span>
          </div>
          <Link
            href="/sign-in"
            className="text-[11px] font-semibold text-emerald-200 hover:text-white px-2 py-1 rounded-lg hover:bg-[#0A5C36] transition"
          >
            Sign In
          </Link>
          <Link
            href="/admin"
            className="text-[11px] font-semibold text-emerald-200 hover:text-white px-2 py-1 rounded-lg hover:bg-[#0A5C36] transition"
          >
            Staff Desk →
          </Link>
        </div>
      </div>
    </header>
  );
}
