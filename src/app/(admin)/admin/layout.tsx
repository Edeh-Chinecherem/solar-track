"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { canAccessRoute } from "@/lib/rbac";
import { AccessRestricted } from "@/components/ui/access-restricted";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { currentRole } = useAuthRole();
  const hasAccess = canAccessRoute(currentRole, pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <React.Suspense fallback={<div className="hidden lg:block w-64 bg-slate-900 min-h-screen" />}>
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </React.Suspense>
      <div className="lg:pl-64 flex flex-col flex-1">
        <React.Suspense fallback={<div className="h-16 border-b border-slate-200 dark:border-slate-800" />}>
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        </React.Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading view...</div>}>
            {hasAccess ? children : <AccessRestricted role={currentRole} areaName="this Operations section" />}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
