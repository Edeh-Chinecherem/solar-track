"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuthRole } from "@/components/providers/auth-role-provider";

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentCustomer, isAuthReady } = useAuthRole();

  useEffect(() => {
    if (isAuthReady && !currentCustomer) {
      router.replace("/sign-in?mode=customer");
    }
  }, [isAuthReady, currentCustomer, router]);

  if (!isAuthReady || !currentCustomer) {
    return (
      <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex items-center justify-center p-6">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-6 py-4 text-xs font-semibold text-[#0A5C36] dark:text-emerald-200 shadow-lg">
          {!isAuthReady ? "Verifying customer session..." : "Redirecting to Customer OTP Sign In..."}
        </div>
      </div>
    );
  }

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

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414]" />}>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </React.Suspense>
  );
}
