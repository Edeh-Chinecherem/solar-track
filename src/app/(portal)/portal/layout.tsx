"use client";

import React from "react";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalNav } from "@/components/portal/portal-nav";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex flex-col pb-20">
      <React.Suspense fallback={<div className="h-14 border-b border-emerald-200 dark:border-emerald-900" />}>
        <PortalHeader />
      </React.Suspense>
      <main className="flex-1 p-4 max-w-lg w-full mx-auto animate-in fade-in-50 duration-150">
        <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-600/80">Loading portal...</div>}>
          {children}
        </React.Suspense>
      </main>
      <React.Suspense fallback={<div className="h-16 fixed bottom-0 inset-x-0" />}>
        <PortalNav />
      </React.Suspense>
    </div>
  );
}
