"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LogOut, ShieldCheck, Smartphone } from "lucide-react";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { ROLE_META } from "@/lib/rbac";

export function HomeHeaderActions() {
  const {
    currentUser,
    currentRole,
    isStaffSignedIn,
    signOutStaff,
    currentCustomer,
    signOutCustomer
  } = useAuthRole();

  if (isStaffSignedIn) {
    const targetHref = currentRole === "technician" ? "/tech" : "/admin";
    return (
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#06361f] border border-emerald-700/70 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="font-bold text-white">{currentUser.name}</span>
          <span className="text-[#EA580C] font-semibold">({ROLE_META[currentRole]?.shortTitle})</span>
        </div>

        <Link
          href={targetHref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A5C36] hover:bg-[#074728] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0A5C36]/30 transition border border-emerald-500/40"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-4 h-4 text-[#EA580C]" />
        </Link>

        <button
          type="button"
          onClick={signOutStaff}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EA580C]/50 bg-[#EA580C]/15 text-orange-200 hover:bg-[#EA580C] hover:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  if (currentCustomer) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#06361f] border border-emerald-700/70 text-xs">
          <Smartphone className="w-3.5 h-3.5 text-[#EA580C]" />
          <span className="font-bold text-white">{currentCustomer.name}</span>
        </div>

        <Link
          href="/portal"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A5C36] hover:bg-[#074728] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0A5C36]/30 transition border border-emerald-500/40"
        >
          <span>Customer Portal</span>
          <ArrowRight className="w-4 h-4 text-[#EA580C]" />
        </Link>

        <button
          type="button"
          onClick={signOutCustomer}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EA580C]/50 bg-[#EA580C]/15 text-orange-200 hover:bg-[#EA580C] hover:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/50 text-emerald-100 hover:bg-[#0A5C36] hover:text-white font-bold text-xs sm:text-sm transition"
      >
        <span>Sign In</span>
      </Link>
      <Link
        href="/sign-up"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs sm:text-sm shadow-md transition"
      >
        <span>Register Role</span>
      </Link>
    </div>
  );
}
