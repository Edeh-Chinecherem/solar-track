"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TechHeader } from "@/components/tech/tech-header";
import { TechBottomNav } from "@/components/tech/tech-bottom-nav";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { canAccessRoute } from "@/lib/rbac";
import { AccessRestricted } from "@/components/ui/access-restricted";

function TechLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, isStaffSignedIn, isAuthReady } = useAuthRole();
  const hasAccess = canAccessRoute(currentRole, pathname);

  useEffect(() => {
    if (isAuthReady && !isStaffSignedIn) {
      const target = pathname ? `?mode=staff&redirect=${encodeURIComponent(pathname)}` : "?mode=staff";
      router.replace(`/sign-in${target}`);
    }
  }, [isAuthReady, isStaffSignedIn, pathname, router]);

  if (!isAuthReady || !isStaffSignedIn) {
    return (
      <div className="min-h-screen bg-emerald-50/40 dark:bg-[#042414] flex items-center justify-center p-6">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-6 py-4 text-xs font-semibold text-[#0A5C36] dark:text-emerald-200 shadow-lg">
          {!isAuthReady ? "Verifying staff session..." : "Redirecting to Staff Sign In..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-[#042414] flex flex-col pb-20">
      <React.Suspense fallback={<div className="h-14 border-b border-emerald-200 dark:border-emerald-900" />}>
        <TechHeader />
      </React.Suspense>
      <main className="flex-1 p-4 max-w-md w-full mx-auto animate-in fade-in-50 duration-150">
        <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-600/80">Loading technician view...</div>}>
          {hasAccess ? children : <AccessRestricted role={currentRole} areaName="the Field Technician interface" />}
        </React.Suspense>
      </main>
      {hasAccess && (
        <React.Suspense fallback={<div className="h-16 fixed bottom-0 inset-x-0" />}>
          <TechBottomNav />
        </React.Suspense>
      )}
    </div>
  );
}

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-emerald-50/40 dark:bg-[#042414]" />}>
      <TechLayoutInner>{children}</TechLayoutInner>
    </React.Suspense>
  );
}
