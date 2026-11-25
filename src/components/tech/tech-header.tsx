"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { GreenerAfrikEmblem, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";

export function TechHeader() {
  const { currentUser } = useAuthRole();

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-slate-900 text-white border-b border-slate-800 shadow-md">
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
            <div className="text-[11px] text-slate-400">Engr: {currentUser.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-[10px] font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Synced</span>
          </div>
          <Link
            href="/admin"
            className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            Staff Desk →
          </Link>
        </div>
      </div>
    </header>
  );
}
