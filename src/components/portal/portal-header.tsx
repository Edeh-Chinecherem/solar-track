"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, LogIn, LogOut } from "lucide-react";
import { GreenerAfrikLogo, GreenerAfrikTopBand } from "@/components/ui/greenerafrik-logo";
import { useAuthRole } from "@/components/providers/auth-role-provider";

export function PortalHeader() {
  const { currentCustomer, signOutCustomer } = useAuthRole();

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-white/95 dark:bg-[#06361f]/95 backdrop-blur border-b border-emerald-200 dark:border-emerald-900 shadow-sm">
      {/* Signature GreenerAfrik Dual Stripe */}
      <GreenerAfrikTopBand />

      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/portal" className="flex items-center gap-2.5">
          <GreenerAfrikLogo size="sm" showTagline={true} />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/portal/support"
            className="flex items-center gap-1 text-xs font-semibold text-[#0A5C36] dark:text-emerald-200 hover:text-[#EA580C] dark:hover:text-orange-400 transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help & Care</span>
          </Link>

          {currentCustomer ? (
            <button
              type="button"
              onClick={signOutCustomer}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#EA580C] border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition cursor-pointer"
              title={`Signed in as ${currentCustomer.name}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/sign-in?mode=customer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#EA580C] text-white hover:bg-[#C2410C] transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>OTP Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
