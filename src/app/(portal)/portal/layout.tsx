"use client";

import React from "react";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalNav } from "@/components/portal/portal-nav";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-20">
      <React.Suspense fallback={<div className="h-14 border-b border-slate-200 dark:border-slate-800" />}>
        <PortalHeader />
      </React.Suspense>
      <main className="flex-1 p-4 max-w-lg w-full mx-auto animate-in fade-in-50 duration-150">
        <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading portal...</div>}>
          {children}
        </React.Suspense>
      </main>
      <React.Suspense fallback={<div className="h-16 fixed bottom-0 inset-x-0" />}>
        <PortalNav />
      </React.Suspense>
    </div>
  );
}
