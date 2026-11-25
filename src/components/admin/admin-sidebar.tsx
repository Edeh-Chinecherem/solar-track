"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Activity,
  LifeBuoy,
  CreditCard,
  QrCode,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { GreenerAfrikLogo } from "@/components/ui/greenerafrik-logo";
import { canAccessRoute, ROLE_META } from "@/lib/rbac";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers Registry", icon: Users },
  { href: "/admin/installations", label: "Installations Pipeline", icon: KanbanSquare },
  { href: "/admin/monitoring", label: "Fleet Monitoring", icon: Activity },
  { href: "/admin/tickets", label: "Support & SLA", icon: LifeBuoy },
  { href: "/admin/payg", label: "PAYG & Remote Control", icon: CreditCard },
  { href: "/admin/scan", label: "QR Hardware Scanner", icon: QrCode },
  { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings & Audit Log", icon: Settings }
];

export function AdminSidebar({
  mobileOpen,
  setMobileOpen
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { currentRole, currentUser } = useAuthRole();

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccessRoute(currentRole, item.href));
  const showTechLink = canAccessRoute(currentRole, "/tech");
  const showPortalLink = canAccessRoute(currentRole, "/portal");

  const navContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-[#05361e] text-white">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="group">
            <GreenerAfrikLogo size="md" textColor="light" showTagline={true} showRc={true} />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-[#074728]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Indicator Card */}
        <div className="rounded-xl bg-[#074728] border border-emerald-700/60 p-3 mx-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
              <span className="text-xs font-semibold text-emerald-100">Active Role</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A5C36] text-emerald-200 border border-emerald-500/40">
              DEMO
            </span>
          </div>
          <div className="mt-1 text-sm font-bold text-white">{ROLE_META[currentRole]?.shortTitle || currentRole}</div>
          <div className="text-[11px] text-emerald-200/80 truncate mt-0.5">{currentUser.name}</div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group",
                  isActive
                    ? "bg-[#0A5C36] text-white font-bold shadow-md shadow-[#042414]/40 border border-emerald-500/30"
                    : "text-emerald-100/80 hover:text-white hover:bg-[#074728]/70"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4", isActive ? "text-[#EA580C]" : "text-emerald-200/80 group-hover:text-[#10B981] transition-colors")} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer quick links */}
      {(showTechLink || showPortalLink) && (
        <div className="pt-4 border-t border-emerald-800/80 space-y-2">
          {showTechLink && (
            <Link
              href="/tech"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-emerald-100/80 hover:text-white hover:bg-[#074728] transition"
            >
              <span>Switch to Technician View</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#EA580C]" />
            </Link>
          )}
          {showPortalLink && (
            <Link
              href="/portal"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-emerald-100/80 hover:text-white hover:bg-[#074728] transition"
            >
              <span>Open Customer Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#EA580C]" />
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-40 border-r border-emerald-900 bg-[#05361e] shadow-xl">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#042414]/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#05361e] shadow-2xl animate-in slide-in-from-left">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
