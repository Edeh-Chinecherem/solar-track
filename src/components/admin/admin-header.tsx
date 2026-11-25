"use client";

import React, { useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  ShieldAlert,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { useAuthRole } from "@/components/providers/auth-role-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, currentRole, switchRole, availableUsers } = useAuthRole();
  const { theme, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleDisplayNames: Record<UserRole, { title: string; badgeColor: string }> = {
    super_admin: { title: "Super Admin", badgeColor: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
    operations_manager: { title: "Operations Manager", badgeColor: "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800" },
    sales: { title: "Sales Executive", badgeColor: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
    technician: { title: "Field Technician", badgeColor: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
    support_agent: { title: "Support Specialist", badgeColor: "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
    finance: { title: "Finance & Accounts", badgeColor: "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800" }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 backdrop-blur transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-slate-100">SolarTrack Operations</span>
          <span>/</span>
          <span>Nigeria Grid & Off-Grid Telemetry</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* ROLE SWITCHER DROPDOWN */}
        <div className="relative">
          <button
            data-testid="role-switcher-btn"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-400 transition cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden md:inline text-slate-400 font-normal">Demo Role:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {roleDisplayNames[currentRole]?.title || currentRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Persona
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Live demo: UI permissions adapt immediately
                  </div>
                </div>

                <div className="mt-1 space-y-1">
                  {availableUsers.map((user) => {
                    const isSelected = user.role === currentRole;
                    const meta = roleDisplayNames[user.role];

                    return (
                      <button
                        key={user.id}
                        data-testid={`role-option-${user.role}`}
                        onClick={() => {
                          switchRole(user.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer",
                          isSelected
                            ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 font-semibold text-amber-950 dark:text-amber-200"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold leading-tight">{meta?.title}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{user.name}</div>
                          </div>
                        </div>
                        {isSelected && <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          data-testid="theme-toggle-btn"
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle color theme"
          title="Toggle light/dark mode"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Public QR shortcut */}
        <Link
          href="/q/ST-LGS-001-X9"
          target="_blank"
          className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 transition"
          title="Open sample public QR landing"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public QR</span>
        </Link>
      </div>
    </header>
  );
}
