"use client";

import React from "react";
import Link from "next/link";
import { Sun, CheckCircle, Wifi, Shield } from "lucide-react";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useTheme } from "@/components/providers/theme-provider";

export function TechHeader() {
  const { currentUser } = useAuthRole();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
          <Sun className="w-5 h-5 fill-slate-950" />
        </div>
        <div>
          <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
            <span>SolarTrack Field</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30">
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
    </header>
  );
}
