"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { canAccessRoute } from "@/lib/rbac";
import { AccessRestricted } from "@/components/ui/access-restricted";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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
      <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex items-center justify-center p-6">
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-[#06361f] px-6 py-4 text-xs font-semibold text-[#0A5C36] dark:text-emerald-200 shadow-lg">
          {!isAuthReady ? "Verifying staff session..." : "Redirecting to Staff Sign In..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414] flex flex-col">
      <React.Suspense fallback={<div className="hidden lg:block w-64 bg-[#05361e] min-h-screen" />}>
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </React.Suspense>
      <div className="lg:pl-64 flex flex-col flex-1">
        <React.Suspense fallback={<div className="h-16 border-b border-emerald-200 dark:border-emerald-900" />}>
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        </React.Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          <React.Suspense fallback={<div className="p-8 text-center text-xs text-emerald-600/80">Loading view...</div>}>
            {hasAccess ? children : <AccessRestricted role={currentRole} areaName="this Operations section" />}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-emerald-50/30 dark:bg-[#042414]" />}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </React.Suspense>
  );
}
