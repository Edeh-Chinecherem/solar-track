"use client";

import React from "react";
import { TechHeader } from "@/components/tech/tech-header";
import { TechBottomNav } from "@/components/tech/tech-bottom-nav";

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col pb-20">
      <React.Suspense fallback={<div className="h-14 border-b border-slate-200 dark:border-slate-800" />}>
        <TechHeader />
      </React.Suspense>
      <main className="flex-1 p-4 max-w-md w-full mx-auto animate-in fade-in-50 duration-150">
        <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading technician view...</div>}>
          {children}
        </React.Suspense>
      </main>
      <React.Suspense fallback={<div className="h-16 fixed bottom-0 inset-x-0" />}>
        <TechBottomNav />
      </React.Suspense>
    </div>
  );
}
